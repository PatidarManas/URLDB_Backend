
import bcrypt from "bcrypt"

import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel.js";

export const islogin = async(req,res)=>{
    try {
        if(req.body.user)return res.status(200).json({success:true,user:req.body.user});
        return res.status(201).json({success:false,user:req.body.user})
    } catch (error) {
        return res.status(400).json(error);
    }
}

export const signup = async(req,res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);        
        const newuser = await UserModel.create({
            Name:req.body.name,
            Email:req.body.email.toLowerCase(),
            Password:hashedPassword,
            API_SECRET_KEY: req.body.email[0] + Date.now(),

        })
        return res.status(200).json({success:true, msg:"User Created Successfully"});
    } catch (error) {
        res.status(400).json(error);
    }
}

export const login = async(req,res)=>{
    try {
        if(req.body.user){
            const token = jwt.sign({ _id: req.body.user._id }, 'process.env.JWT_SECRET', {
                expiresIn: "15d",
            })
            return res.status(200).json({success:true,token});
        }else{
            return res.status(201).json({success:false,msg:"Invalid Authentication"});
        }
    } catch (error) {
        return res.status(400).json({error});
    }
}


export const getUserDetails = async(req,res)=>{
    try {
        if(req.body.user){
           
            return res.status(200).json({success:true,user:req.body.user});
        }else{
            return res.status(201).json({success:false,msg:"Invalid Authentication"});
        }
    } catch (error) {
        return res.status(400).json({error});       
    }
}


export const getPremium = async(req,res)=>{
    try {
        await UserModel.findByIdAndUpdate(req.body.user._id,{
            $set:{ isPrimeUser:true}
        });
        return res.status(200).json({success:true})
    } catch (error) {
        return res.status(400).json({error});       
    }
}