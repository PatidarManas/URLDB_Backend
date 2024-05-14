
import express from "express";
import { checkDbMiddleware, checkModalMiddleware, createDbMiddleware, createModalMiddleware } from "../middlewares/ApiMiddlewares.js";
import { addData, createDb, createModal, deleteData, deteleModal, getAllData, getAllModals, getData } from "../controlers/ApiHitHandler.js";
const app = express.Router();

// API: to create database
app.get("/create_db/:DB_NAME", createDbMiddleware,createDb);

// API: to create Modal
app.get("/create_modal/:DB_NAME/:MODAL_NAME",checkDbMiddleware,createModalMiddleware,createModal );

// API: to add data
app.get("/add_data/:DB_NAME/:MODAL_NAME",checkDbMiddleware,checkModalMiddleware,addData );

// API: to delete data
app.get("/delete_data/:DB_NAME/:MODAL_NAME",checkDbMiddleware,checkModalMiddleware,deleteData );

// API: to delete modal
app.get("/delete_modal/:DB_NAME/:MODAL_NAME",checkDbMiddleware,checkModalMiddleware,deteleModal );

// API: to get all modals
app.get("/get_all_modal/:DB_NAME",checkDbMiddleware,getAllModals );

// API: to get all datas
app.get("/get_all_data/:DB_NAME/:MODAL_NAME",checkDbMiddleware,checkModalMiddleware,getAllData );

// API: to get filter datas
app.get("/get_data/:DB_NAME/:MODAL_NAME",checkDbMiddleware,checkModalMiddleware,getData );



export  {app as Apiroute} ;