
import mongoose from "mongoose";
import express from "express";

import jwt from "jsonwebtoken"
import { Adminuser } from "../models/Adminuser.js";
import { Instance } from "../models/Instance.js";
import { Deleteinstance, authenticateAdminUser, Createinstance, login, signup, Createdatabase, Deletedatabase, Createusers, DeleteUser, ChangePassword, Getinstances, Getoneinstance, islogin } from "../controlers/Admincontroller.js";
const app = express.Router();
// API: Signup to admin user
app.post("/api/signup", signup);

// API: Login to admin user
app.post("/api/login", login);

// API: is already Login to admin user
app.post("/api/islogin", authenticateAdminUser, islogin);

// API: Create instance
app.post("/api/create-instance", authenticateAdminUser, Createinstance);

// API: Get instances
app.post("/api/get-instances", authenticateAdminUser, Getinstances);

// API: Get instances
app.post("/api/get-one-instance", authenticateAdminUser, Getoneinstance);

// API: Delete instance
app.post("/api/delete-instance", authenticateAdminUser, Deleteinstance);

// API: Create database
app.post("/api/create-database", authenticateAdminUser, Createdatabase);

// API: Delete database
app.post("/api/delete-database", authenticateAdminUser,Deletedatabase );

// API: Create users
app.post("/api/create-users", authenticateAdminUser, Createusers);

// API: Get user
app.post("/api/get-user", authenticateAdminUser, Createusers);
// API: Delete user
app.post("/api/delete-user", authenticateAdminUser, DeleteUser);

// API: Change user password
app.post("/api/change-password", authenticateAdminUser,ChangePassword );

export default app;