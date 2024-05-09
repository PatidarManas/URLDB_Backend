import mongoose from "mongoose";

const schema = new mongoose.Schema({
    UserEmail:{
        type:String,
        required:true
    },
    Name:{
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
    Modal_names:[]
   
}, { timestamps: true });

mongoose.models = {};

export const DatabaseModel = mongoose.model("DatabaseModel", schema);