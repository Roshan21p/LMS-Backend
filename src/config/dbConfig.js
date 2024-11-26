import mongoose from 'mongoose';

import { DB_URL } from './serverConfig.js';
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(DB_URL);

    console.log(`Connected to MongDB: ${connect.connection.host}`);
  } catch (error) {
    console.log('Not able to connect to the mongodb server');
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
