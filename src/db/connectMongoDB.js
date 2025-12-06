import mongoose from 'mongoose';

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
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
  } catch (err) {
    console.error('Error connecting to mongoDB', err.message);
    process.exit(1);
  }
};
