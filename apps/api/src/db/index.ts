import mongoose from 'mongoose';
import { env } from '../config/env';
import { 
  MongooseUser, 
  MongooseCategory, 
  MongooseProduct, 
  MongooseCoupon, 
  MongoosePromotion 
} from './mongoose';
import { 
  SEED_USERS, 
  SEED_CATEGORIES, 
  SEED_PRODUCTS, 
  SEED_COUPONS, 
  SEED_PROMOTIONS 
} from '@ecom/contracts';

export const isMongooseMode = !!env.MONGODB_URI;

export const seedDatabase = async () => {
  try {
    const userCount = await MongooseUser.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding users into MongoDB...');
      for (const user of SEED_USERS) {
        await MongooseUser.create({ ...user });
      }
    }

    const catCount = await MongooseCategory.countDocuments();
    if (catCount === 0) {
      console.log('🌱 Seeding categories into MongoDB...');
      for (const cat of SEED_CATEGORIES) {
        await MongooseCategory.create({ ...cat, _id: cat.id });
      }
    }

    const prodCount = await MongooseProduct.countDocuments();
    if (prodCount === 0) {
      console.log('🌱 Seeding products into MongoDB...');
      for (const prod of SEED_PRODUCTS) {
        await MongooseProduct.create({ ...prod, _id: prod.id });
      }
    }

    const couponCount = await MongooseCoupon.countDocuments();
    if (couponCount === 0) {
      console.log('🌱 Seeding coupons into MongoDB...');
      for (const coupon of SEED_COUPONS) {
        await MongooseCoupon.create({ ...coupon, _id: coupon.id });
      }
    }

    const promoCount = await MongoosePromotion.countDocuments();
    if (promoCount === 0) {
      console.log('🌱 Seeding promotions into MongoDB...');
      for (const promo of SEED_PROMOTIONS) {
        await MongoosePromotion.create({ ...promo, _id: promo.id });
      }
    }
    console.log('✅ MongoDB database seeded successfully.');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
  }
};

export const connectDatabase = async () => {
  if (isMongooseMode) {
    try {
      console.log('🔌 Connecting to MongoDB Atlas...');
      await mongoose.connect(env.MONGODB_URI!);
      console.log('✅ MongoDB connected successfully.');
      await seedDatabase();
    } catch (err) {
      console.error('❌ Failed to connect to MongoDB:', err);
      process.exit(1);
    }
  } else {
    console.log('📂 MONGODB_URI not found. Running in Local-File Fallback Mode using JSON DB.');
  }
};

