//src/db/connectMongoDB.js

import mongoose from 'mongoose';
import { Note } from '../models/note.js';

const clientOptions = {
  serverApi: { version: '1', strict: false, deprecationErrors: true },
};

export const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGO_URL;

    await mongoose.connect(uri, {
      ...clientOptions,
      dbName: 'notes',
    });

    await mongoose.connection.db.admin().command({ ping: 1 });

    console.log(
      '✅ MongoDB connection established successfully. DB:',
      mongoose.connection.name,
    );
    await Note.syncIndexes();
    console.log('Indexes synced successfully');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB', err.message);
    process.exit(1);
  }
};
