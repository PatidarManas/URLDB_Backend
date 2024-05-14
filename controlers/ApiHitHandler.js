import { DatabaseModel } from "../models/DatabaseModel.js";
import { ModalModel } from "../models/ModalModel.js";
import { UserModel } from "../models/UserModel.js";

export const createDb = async (req, res) => {
  try {
    const DB_NAME = req.params.DB_NAME;
    const createdDb = await DatabaseModel.create({
      UserEmail: req.body.user.Email,
      Name: DB_NAME,
    });
    await UserModel.findByIdAndUpdate(req.body.user._id, {
      $push: { Databases_names: DB_NAME },
      lastApiHit: Date.now(),
      NoOfApiHits: req.body.user.NoOfApiHits + 1,
    });
    delete createdDb._id;
    return res.status(200).json({ success: true,msg : "Databse Created Successful"});
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const createModal = async (req, res) => {
  try {
    const MODAL_NAME = req.params.MODAL_NAME;
    const DB_NAME = req.params.DB_NAME;

    const createdModal = await ModalModel.create({
      Name: MODAL_NAME,
      Database_name: DB_NAME,
      UserEmail: req.body.user.Email,
    });
    await DatabaseModel.findByIdAndUpdate(req.body.db._id, {
      $push: { Modal_names: MODAL_NAME },
    });
    await UserModel.findByIdAndUpdate(req.body.user._id, {
      lastApiHit: Date.now(),
      NoOfApiHits: req.body.user.NoOfApiHits + 1,
    });
    delete createdModal._id;
    res.status(200).json({ success: true, msg : "Modal Created Successful" });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const addData = async (req, res) => {
  try {
    const queryParams = req.query;
    const updatedModal = await ModalModel.findByIdAndUpdate(
      req.body.modal._id,
      {
        $push: { DataArray: queryParams },
      },
      { new: true }
    );
    await UserModel.findByIdAndUpdate(req.body.user._id, {
      lastApiHit: Date.now(),
      NoOfApiHits: req.body.user.NoOfApiHits + 1,
    });
    await updatedModal.save();
    return res.json({ success: true, msg: "Data Added Successfully" });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const deleteData = async (req, res) => {
  try {
    const queryParams = req.query;
    let dataArray = req.body.modal.DataArray;
    // Filter the array based on query parameters
    dataArray = dataArray.filter((obj) => {
      // Check if all query parameters match
      for (const key in queryParams) {
        if (obj[key] !== queryParams[key]) {
          return true; // Return true to keep the object
        }
      }
      return false; // Return false to remove the object
    });
    await ModalModel.findByIdAndUpdate(req.body.modal._id, {
      DataArray: dataArray,
    });
    await UserModel.findByIdAndUpdate(req.body.user._id, {
      lastApiHit: Date.now(),
      NoOfApiHits: req.body.user.NoOfApiHits + 1,
    });
    return res.json({ success: true, msg: "Data Deleted Successfuly" });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const deteleModal = async (req, res) => {
  try {
    await ModalModel.findByIdAndDelete(req.body.modal._id);
    await DatabaseModel.findByIdAndUpdate(req.body.db._id,{
      $pull:{Modal_names:req.body.modal.Name}
    });
    await UserModel.findByIdAndUpdate(req.body.user._id, {
      lastApiHit: Date.now(),
      NoOfApiHits: req.body.user.NoOfApiHits + 1,
    });
    return res.status(200).json({ success: true, msg: "Modal Deleted Successful" });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getAllModals = async (req, res) => {
  try {
    const allModalNames = req.body.db.Modal_names;
    await UserModel.findByIdAndUpdate(req.body.user._id, {
      lastApiHit: Date.now(),
      NoOfApiHits: req.body.user.NoOfApiHits + 1,
    });
    return res.status(200).json(allModalNames);
  } catch (error) {
    res.status(400).json(error);
  }
};


export const getAllData = async (req, res) => {
  try {
    const allData = req.body.modal.DataArray;
    await UserModel.findByIdAndUpdate(req.body.user._id, {
      lastApiHit: Date.now(),
      NoOfApiHits: req.body.user.NoOfApiHits + 1,
    });
    return res.status(200).json(allData );
  } catch (error) {
    res.status(400).json(error);
  }
};


export const getData = async (req, res) => {
  try {
    const queryParams = req.query;
    let dataArray = req.body.modal.DataArray;
    // Filter the array based on query parameters
    dataArray = dataArray.filter((obj) => {
      // Check if all query parameters match
      for (const key in queryParams) {
        if (obj[key] !== queryParams[key]) {
          return false; // Return true to keep the object
        }
      }
      return true; // Return false to remove the object
    });
    await UserModel.findByIdAndUpdate(req.body.user._id, {
      lastApiHit: Date.now(),
      NoOfApiHits: req.body.user.NoOfApiHits + 1,
    });
    return res.json(dataArray);
  } catch (error) {
    res.status(400).json(error);
  }
};