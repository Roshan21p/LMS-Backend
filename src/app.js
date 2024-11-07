import express  from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import userRouter from './routes/userRoute.js';
import authRouter from './routes/authRoute.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true}));


app.use(morgan('dev'));

app.use(cookieParser());

// Routing middleware
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

app.use('/ping', function(req, res){
    res.send('Pong');
})

app.use(errorMiddleware);


export default app;