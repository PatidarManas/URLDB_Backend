import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    lastLogin: { type: Date },
    operationHistory: [
      {
        operation: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  });
  mongoose.models = {};

  export const Adminuser = mongoose.model("Adminuser", adminUserSchema);