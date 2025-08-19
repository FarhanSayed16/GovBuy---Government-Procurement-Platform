// jest.setup.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { DB_NAME } from './src/constants.js';

dotenv.config({ path: '.env.test' });

beforeAll(async () => {
  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});