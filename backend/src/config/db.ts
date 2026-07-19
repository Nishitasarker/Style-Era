import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/style_era';

export let isMongoConnected = false;

export async function connectDB(): Promise<boolean> {
  try {
    console.log('Attempting to connect to MongoDB at:', MONGODB_URI.replace(/\/\/.*@/, '//<credentials>@'));
    
    // Set connection timeout to 4 seconds for fast feedback
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 4000,
    });
    
    isMongoConnected = true;
    console.log('MongoDB Connected successfully!');
    return true;
  } catch (error: any) {
    console.warn('\n======================================================');
    console.warn('WARNING: MongoDB connection failed.');
    console.warn('Error detail:', error.message || error);
    console.warn('Style Era will boot in OFFLINE mock storage mode.');
    console.warn('All read/write operations will run on in-memory storage.');
    console.warn('======================================================\n');
    isMongoConnected = false;
    return false;
  }
}
