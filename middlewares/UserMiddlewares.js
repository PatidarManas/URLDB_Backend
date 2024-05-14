import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel.js";
import bcrypt from "bcrypt"


export const isUserAuthenticatedMiddleware = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (token) {
      const decoded = await jwt.verify(
        token.substring(6),
        "process.env.JWT_SECRET"
      );
      const decodedUser = await UserModel.findById(decoded._id);
      req.body.user = decodedUser;
      next();
    } else {
      res.status(201).json({
        success: false,
        message: "not logged in",
      });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};


export const signupMiddleware = async (req, res, next) => {
    try {
        const ifAlreadyUser = await UserModel.findOne({Email:req.body.email.toLowerCase()});
        if(ifAlreadyUser){
           return res.status(205).json({success:false,msg:"Email Already exists"});
        }
        next();
    } catch (error) {
        return res.status(400).json(error);
    }
}

export const loginMiddleware = async (req,res,next)=>{
    try {
        const passFromUser = req.body.password;

        const foundUser = await UserModel.findOne({Email:req.body.email.toLowerCase()});
        const isPasswordValid = await bcrypt.compare(passFromUser, foundUser.Password);
        if (foundUser && isPasswordValid){
          req.body.user=foundUser;
          next();
        }else{
          return res.status(201).json({success:false,msg:"UnAuthenticated User Details"});
        }
    } catch (error) {
        return res.status(400).json(error);
    }
}