// src/controllers/authController.js

import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { sendEmail } from '../utils/sendMail.js';

// Реєстрація
export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createHttpError(400, 'Email in use'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    const session = await createSession(newUser._id);

    setSessionCookies(res, session);

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

// Логін
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Перевіряємо чи користувач з такою поштою існує
    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(401, 'Invalid credentials'));
    }

    // 2. Порівнюємо хеші паролів
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return next(createHttpError(401, 'Invalid credentials'));
    }

    // 3. Видаляємо стару сесію користувача (якщо була)
    await Session.deleteOne({ userId: user._id });

    // 4. Створюємо нову сесію
    const session = await createSession(user._id);

    // 5. Ставимо кукі
    setSessionCookies(res, session);

    // 6. Повертаємо користувача (пароль автоматично прибрано через toJSON)
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

//Refresh
export const refreshUserSession = async (req, res, next) => {
  try {
    // 1. Знаходимо поточну сесію за id сесії та рефреш токеном
    const session = await Session.findOne({
      _id: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    // 2. Якщо такої сесії нема, повертаємо помилку
    if (!session) {
      return next(createHttpError(401, 'Session not found'));
    }

    // 3. Якщо сесія існує, перевіряємо валідність рефреш токена
    const isSessionTokenExpired =
      new Date() > new Date(session.refreshTokenValidUntil);

    // Якщо термін дії рефреш токена вийшов, повертаємо помилку
    if (isSessionTokenExpired) {
      return next(createHttpError(401, 'Session token expired'));
    }

    // 4. Якщо всі перевірки пройшли добре, видаляємо поточну сесію
    await Session.deleteOne({
      _id: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    // 5. Створюємо нову сесію та додаємо кукі
    const newSession = await createSession(session.userId);
    setSessionCookies(res, newSession);

    res.status(200).json({
      message: 'Session refreshed',
    });
  } catch (error) {
    next(error);
  }
};

// logout
export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

// POST /auth/request-reset-email
export const requestResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // По ТЗ: если user нет — всё равно 200 с этим сообщением
    if (!user) {
      return res.status(200).json({
        message: 'Password reset email sent successfully',
      });
    }

    const token = jwt.sign(
      { sub: user._id.toString(), email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' },
    );

    const link = `${process.env.FRONTEND_DOMAIN}/reset-password?token=${token}`;

    const templatePath = path.resolve(
      'src/templates/reset-password-email.html',
    );
    const templateSource = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);
    const html = template({ name: user.username, link });

    try {
      await sendEmail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Reset your password',
        html,
      });
    } catch {
      return next(
        createHttpError(
          500,
          'Failed to send the email, please try again later.',
        ),
      );
    }

    return res.status(200).json({
      message: 'Password reset email sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

// POST /auth/reset-password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return next(createHttpError(401, 'Invalid or expired token'));
    }

    const user = await User.findOne({ _id: payload.sub, email: payload.email });
    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ _id: user._id }, { password: hashedPassword });

    return res.status(200).json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};
