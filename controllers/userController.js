import UserModel from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserController {
  
  static userRegistration = async (req, res) => {
    try{  
    const { name, email, password} = req.body;
    const user = await UserModel.findOne({ email: email });

    if (user) {
      res.send({ "Status": "Failed", "Message": "Email already in use" });
    } else {
      if (name && email && password) {
        if (password) {
          try {
            const saltRound = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, saltRound);
            const doc = new UserModel({
              name: name,
              email: email,
              password: hashedPassword,
            
            });
            await doc.save();
            const savedUser = await UserModel.findOne({ email: email });
            // JWT generation
            const token = jwt.sign({ userID: savedUser._id }, process.env.JWT_KEY, { expiresIn: '5d' });
            res.status(201).send({ "Status": "Success", "Message": "Registration Successful", "Token": token });
          } catch (error) {
            console.log(error);
            res.send({ "Status": "Failed", "Message": "Registration failed!" });
          }
        } else {
          res.send({ "Status": "Failed", "Message": "Password and Confirm Password don't match!" });
        }
      } else {
        res.send({ "Status": "Failed", "Message": "All fields are required" });
      }
    } } catch(e){console.log(e);}
  }

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });
        if (user != null) {
          const passwordMatch = await bcrypt.compare(password, user.password);
          if ((user.email === email) && passwordMatch) {
            const token = jwt.sign({ userID: user._id }, process.env.JWT_KEY, { expiresIn: '5d' });
            res.send({ "Status": "Success", "Message": "Login Successful", "Token": token });
          } else {
            res.send({ "Status": "Failed", "Message": "Email or Password is not valid" });
          }
        } else {
          res.send({ "Status": "Failed", "Message": "You are not a Registered User!" });
        }
      } else {
        res.send({ "Status": "Failed", "Message": "All fields have to be filled" });
      }
    } catch (error) {
      console.log(error);
      res.send({ "Status": "Failed", "Message": "Failed to Login" });
    }
  }

  

  static loggedUser = async (req, res) => {
    res.send({ "User": req.user });
  }
}

export default UserController;
