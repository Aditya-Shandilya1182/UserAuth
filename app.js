import connectDB from './config/connectdb.js';
import userRoutes from './routes/userRoutes.js';

const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(cors());

connectDB(DATABASE_URL)

app.use(express.json());

app.use("/api/user", userRoutes)

app.listen(port, () => {
    console.log('server is listening to port ......')
});