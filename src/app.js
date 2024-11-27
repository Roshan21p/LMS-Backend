import dotenv from 'dotenv';
import express from 'express';
dotenv.config();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

import { FRONTEND_URL } from './config/serverConfig.js';
import authRouter from './routes/authRoute.js';
import courseRouter from './routes/courseRoute.js';
import miscRouter from './routes/miscellaneousRoute.js';
import paymentRouter from './routes/paymentRoute.js';
import userRouter from './routes/userRoute.js';

const app = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// Third-Party
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true
  })
);

app.use(morgan('dev'));

app.use(cookieParser());

// Routing middleware
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1', miscRouter);

app.use('/ping', function (req, res) {
  res.send('Pong');
});

export default app;
