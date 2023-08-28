import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/connectdb.js';
import userRoutes from './routes/userRoutes.js';
import UserController from './controllers/userController.js';

dotenv.config();

const app = express();
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(cors());

connectDB(DATABASE_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", userRoutes);


app.get('/', function(req, res){
    console.log("Root Route")
    res.json({ message: "hello world" });
});

app.listen(port, () => {
    console.log('server is listening to port ......');
});
