import mongoose from "mongoose";

const schema = new mongoose.Schema({
    API_SECRET_KEY:{
        type:String,
        required:true,
    },
    Name:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        required:true,
    },
    Password:{
        type:String,
        required:true,
    },
    SpaceOccupied:{
        type:Number,
        default:0
    },
    NoOfApiHits:{
        type:Number,
        default:0
    },
    isPrimeUser:{
        type:Boolean,
        default:false,
    },
    lastApiHit:{
        type:Date,
        default:Date.now(),
    },
    Databases_names:[]
   
}, { timestamps: true });

mongoose.models = {};

export const UserModel = mongoose.model("UserModel", schema);