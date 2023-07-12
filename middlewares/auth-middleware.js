import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken';

var authenticateUser = async (req,res,next) => {
    let token;
    const { authorization } = req.headers;
    if(authorization && authorization.startsWith('Bearer')){
        try{
            token = authorization.split(' ')[1];

            const { userID } = jwt.verify(token, process.env.JWT_KEY);

            req.user = await UserModel.findById(userID).select('-password');

            next();
        } catch{
            console.log(error);
            res.status(401).send({ "Status": "Failed", "Message": "Unauthorized User" });
        }
        if(!token) {
            res.status(401).send({ "Status": "Failed", "Message": "Unauthorized User" });
        }
    }
}

export default authenticateUser;