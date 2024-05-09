import mongoose from "mongoose";

const schema = new mongoose.Schema({
    UserEmail:{
        type:String,
        required:true
    },
    Database_name:{
        type:String,
        required:true
    },
    Name:{
        type:String,
        required:true,
    },
    DataArray:[]
   
}, { timestamps: true });

mongoose.models = {};

export const ModalModel = mongoose.model("ModalModel", schema);