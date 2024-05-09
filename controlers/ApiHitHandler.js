import { DatabaseModel } from "../models/DatabaseModel.js";
import { ModalModel } from "../models/ModalModel.js";
import { UserModel } from "../models/UserModel.js";


export const createDb = async(req,res)=>{
    try {
        const DB_NAME = req.params.DB_NAME;
        const createdDb = await DatabaseModel.create({
            UserEmail:req.body.user.Email,
            Name:DB_NAME,
            
        });
        await UserModel.findByIdAndUpdate(req.body.user._id,{
            $push:{Databases_names:DB_NAME},
            lastApiHit:Date.now(),
            NoOfApiHits:req.body.user.NoOfApiHits + 1,
        });
        delete createdDb._id;
        return res.status(200).json({success:true,created_database:createdDb});
    } catch (error) {
        return res.status(400).json(error);
    }
}


export const createModal=async(req,res)=>{
    try {
        const MODAL_NAME = req.params.MODAL_NAME;
        const DB_NAME = req.params.DB_NAME;

        const createdModal = await ModalModel.create({
            Name:MODAL_NAME,
            Database_name:DB_NAME,
            UserEmail:req.body.user.Email,
        });
        await DatabaseModel.findByIdAndUpdate(req.body.db._id,{
            $push:{Modal_names:MODAL_NAME}
        });
        await UserModel.findByIdAndUpdate(req.body.user._id,{
            lastApiHit:Date.now(),
            NoOfApiHits:req.body.user.NoOfApiHits + 1,
        });
        delete createdModal._id;
        res.status(200).json({success:true,created_modal : createdModal});
    } catch (error) {
        res.status(400).json(error);
    }
}

export const addData = async(req,res)=>{
    try {
        
    } catch (error) {
        res.status(400).json(error);
    }
}