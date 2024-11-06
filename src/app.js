import express  from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
dotenv.config();

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.use(cookieParser());

app.use('/ping', function(req, res){
    res.send('Pong');
})

export default app;