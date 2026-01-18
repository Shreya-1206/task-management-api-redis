import mongoose from 'mongoose';

export default async function mongooseLoader() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('❌ MONGODB_URI is not defined');
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed');
    throw error;
  }
}