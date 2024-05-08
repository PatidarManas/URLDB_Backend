import app from "./app.js";
import mongoose from "mongoose";

import { config } from "dotenv";
config();
export const connectDB = async () => {
  const { connection } = await mongoose.connect("mongodb+srv://manaspatidar170:Nnx1ur1GOxFirhdN@cluster0.y7ctlv4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
  console.log(`MongoDB connected with ${connection.host}`);
};
connectDB();

app.listen(4000, () => {
  console.log(`Server is working on port: ${process.env.PORT}`);
});