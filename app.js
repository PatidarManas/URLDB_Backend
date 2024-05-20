// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import { apiSecretMiddleware } from "./middlewares/ApiMiddlewares.js";
// import { Apiroute } from "./routes/ApiRoutes.js";
// import { userRoutes } from "./routes/UserRoutes.js.js";


// const app = express();


// app.use(express.json());
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );

// export default app;

// // app.use("/",router)
// app.use("/1/:API_SECRET_KEY",apiSecretMiddleware,Apiroute)
// app.use("/api/",userRoutes)

// app.get("/", (req, res) =>
//   res.send(
//     `<h1>Site is Working. click <a href=${process.env.FRONTEND_URL}>here</a> to visit frontend.</h1>`
//   )
// );