import UserModel from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserController {
    static userRegistration = async (req, res) => {
        const {name, email, password, password_confirmation, tc} = req.body;
        const user = await UserModel.findOne({ email: email });

        if(user){
            res.send({"Status" : "Failed", "Message" : "Email already in use"});
        } else {
            if(name && email && password && password_confirmation && tc){
                if(password == password_confirmation){
                    try{
                        const saltRound = await bcrypt.genSalt(10);
                        const hashedPassword = await bcrypt.hash(password, saltRound);
                        const doc = new UserModel({
                            name: name,
                            email: email,
                            password: hashedPassword,
                            tc: tc,
                        });
                        await doc.save();
                        const savedUser = await UserModel.findOne({email: email});
                        //JWT genration
                        const token = jwt.sign({ userID: savedUser._id }, process.env.JWT_KEY, { expiresIn: '5d' });
                        res.status(201).send({ "Status": "Success", "Message": "Registration Successful", "Token": token });
                    } catch(error) {
                        console.log(error);
                        res.send({"Status" : "Failed", "Message" : "Registration failed!"});
                    }
                } else {
                    res.send({ "Status": "Failed", "Message": "Password and Confirm Password doesn't match!" });
                }
            } else {
                res.send({ "Status": "Failed", "Message": "All fields are required" });
            }
        }
    }

    static userLogin = async (req, res) => {
        try{
            const {email, password} = req.body;
            if(email && password){
                const user = await UserModel.findOne({email: email});
                if(user != null) {
                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if((user.email === email) && isMatch){
                        const token = jwt.sign({ userID: user._id }, process.env.JWT_KEY, { expiresIn: '5d' });
                        res.send({ "Status": "Success", "Message": "Login Successful", "Token": token });
                    } else {
                        res.send({ "Status": "Failed", "Message": "Email or Password is not Valid" });
                    }
                } else {
                    res.send({"Status": "Failed", "Message": "You are not a Registered User!"});
                }
            } else {
                res.send({"Status" : "Failed", "Message" : "All Field has to be filled"});
            }
        } catch (error) {
            console.log(error);
            res.send({ "Status": "Failed", "Message": "Failed to Login" });
        }
    }

    static changeUserPassword = async (req,res) => {
        const {password, password_confirmation} = req.body;
        if(password && password_confirmation){
            if(password != password_confirmation){
                res.send({ "Status": "Failed", "Message": "New Password and Confirm New Password did not match!" });
            } else {
                const saltRound = await bcrypt.genSalt(10);
                const newHashedPassword = await bcrypt.hash(password, saltRound);
                await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashedPassword } });
                res.send({ "Status": "Success", "Message": "Password changed succesfully!" });
            }
        } else {
            res.send({ "Status": "Failed", "Message": "All Fields are Required" });
        }
    }

    static loggedUser = async (req, res) => {
        res.send({ "User": req.user })
   }
}

export default UserController;