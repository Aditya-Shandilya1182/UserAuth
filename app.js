import connectDB from './config/connectdb.js';
import userRoutes from './routes/userRoutes.js';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';

const app = express();
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(cors());

connectDB(DATABASE_URL)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", userRoutes)

app.listen(port, () => {
    console.log('server is listening to port ......')
});