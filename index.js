
import mongoose from "mongoose";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { apiSecretMiddleware } from "./middlewares/ApiMiddlewares.js";
import { Apiroute } from "./routes/ApiRoutes.js";
import { userRoutes } from "./routes/UserRoutes.js.js";
import { config } from "dotenv";


config();

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

export const connectDB = async () => {
  const { connection } = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected with ${connection.host}`);
};
connectDB();


app.use("/1/:API_SECRET_KEY",apiSecretMiddleware,Apiroute)
app.use("/api/",userRoutes)

app.get("/", (req, res) =>
  res.send(
    `<h1>Site is Working. click <a href=${process.env.FRONTEND_URL}>here</a> to visit frontend.</h1>`
  )
);

app.listen(4000, () => {
  console.log(`Server is working on port: ${process.env.PORT}`);
});
