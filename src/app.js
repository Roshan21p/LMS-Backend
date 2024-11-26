import dotenv from 'dotenv';
import express from 'express';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import authRouter from './routes/authRoute.js';
import courseRouter from './routes/courseRoute.js';
import paymentRouter from './routes/paymentRoute.js';
import userRouter from './routes/userRoute.js';

const app = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use(cookieParser());

// Routing middleware
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/payments', paymentRouter);

app.use('/ping', function (req, res) {
  res.send('Pong');
});

export default app;
