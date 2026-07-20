import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isMongoConnected } from './config/db';
import { itemsMockStore } from './config/mockStore';
import { Item } from './models/Item';
import authRoutes from './routes/auth';
import itemRoutes from './routes/items';
import aiRoutes from './routes/ai';
import userRoutes from './routes/users'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.split(',') : ["https://style-era-nine.vercel.app"],  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', userRoutes); 

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: isMongoConnected ? 'MongoDB Connected' : 'Offline Mock Storage',
    timestamp: new Date()
  });
});

// Database seeding logic
async function seedDatabase() {
  if (!isMongoConnected) return;

  try {
    const count = await Item.countDocuments();
    if (count === 0) {
      console.log('MongoDB catalog is empty. Seeding initial premium collections...');
      
      const seedItems = itemsMockStore.map(({ _id, ...rest }) => rest);
      await Item.insertMany(seedItems);
      console.log('Successfully seeded database with premium collections.');
    } else {
      console.log(`Database already populated with ${count} items. Skipping seed.`);
    }
  } catch (error: any) {
    console.error('Failed to seed database:', error.message || error);
  }
}

// Start Server
async function startServer() {
  await connectDB();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`Style Era Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Storage Mode: ${isMongoConnected ? 'MongoDB' : 'In-Memory/Mock'}`);
    console.log(`=================================================`);
  });
}

startServer();