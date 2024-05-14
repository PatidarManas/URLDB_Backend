
import express from "express";
import { isUserAuthenticatedMiddleware, loginMiddleware, signupMiddleware } from "../middlewares/UserMiddlewares.js";
import { getPremium, getUserDetails, islogin, login, signup } from "../controlers/UserController.js";


const app = express.Router();

// API: is already Login to user
app.post("/islogin", isUserAuthenticatedMiddleware, islogin);


// API: Signup to user
app.post("/signup", signupMiddleware,signup);

// API: Login to user
app.post("/login", loginMiddleware,login);

// API: Login to admin user
app.post("/get_user_details", isUserAuthenticatedMiddleware,getUserDetails);

// API: upgrade to premium
app.post("/update_to_premium", isUserAuthenticatedMiddleware,getPremium);

export { app as userRoutes};