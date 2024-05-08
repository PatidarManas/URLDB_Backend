import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String },
    billAmount: { type: Number , default: 0},
    permission: { type: String, enum: ['read', 'readwrite'], default: 'read' }
  });
  
  const databaseSchema = new mongoose.Schema({
    databaseId: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    lastModifiedDate: { type: Date, default: Date.now },
    users: [userSchema]
  });
  
  const instanceSchema = new mongoose.Schema({
    instanceId: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    lastModifiedDate: { type: Date, default: Date.now },
    occupiedSpace: { type: Number },
    databases: [databaseSchema]
  });

mongoose.models = {};

export const Instance = mongoose.model("Instance", instanceSchema);