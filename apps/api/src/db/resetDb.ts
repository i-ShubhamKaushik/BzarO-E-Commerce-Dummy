import mongoose from 'mongoose';
import { env } from '../config/env';
import { seedDatabase } from './index';

const resetDb = async () => {
  if (!env.MONGODB_URI) {
    console.log('📂 Running in JSON DB Mode. JSON database files are already synchronized. No MongoDB reset needed.');
    process.exit(0);
  }

  try {
    console.log('🔌 Connecting to MongoDB Atlas for reset...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to MongoDB.');

    const collectionsToDrop = ['users', 'categories', 'products', 'coupons', 'promotions', 'carts', 'wishlists', 'orders', 'reviews'];
    const dbCollections = mongoose.connection.collections;

    for (const collName of collectionsToDrop) {
      if (dbCollections[collName]) {
        console.log(`🗑️ Dropping collection: ${collName}`);
        try {
          await dbCollections[collName].drop();
          console.log(`✅ Collection ${collName} dropped successfully.`);
        } catch (err: any) {
          console.warn(`⚠️ Warning dropping ${collName}:`, err.message);
        }
      } else {
        console.log(`ℹ️ Collection ${collName} does not exist. Skipping.`);
      }
    }

    console.log('🌱 Re-seeding database...');
    await seedDatabase();
    console.log('🎉 Database reset & seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  }
};

resetDb();
