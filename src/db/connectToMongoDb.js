import mongoose from 'mongoose';

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};

export const connectToMongoDB = async () => {
  try {
    const uri = process.env.MONGO_URL;

    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('✅ MongoDB connection established successfully');
  } catch (err) {
    console.error('Error connecting to mongoDB', err.message);
    process.exit(1);
  }
};
