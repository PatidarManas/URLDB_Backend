import mongoose from "mongoose";
import express from "express";

import jwt from "jsonwebtoken";
import { Adminuser } from "../models/Adminuser.js";
import { Instance } from "../models/Instance.js";


export const islogin = async(req,res)=>{
  return res.status(200).json({});
}
export const signup = async (req, res) => {
  try {
    // Check if referral secret code matches
    const checkuser = await Adminuser.findOne({ username: req.body.username });
    if (checkuser) {
      res.status(201).json("already exists");
      return;
    }
    if (req.body.referralsecretcode == "incriptedpass") {
      // Proceed with creating admin user
      const adminUser = new Adminuser({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
      });

      // Save user details to database
      await adminUser.save();

      res.status(200).json({ message: "Admin user created successfully" });
    } else {
      // Reject signup due to invalid referral secret code
      res.status(203).json({ message: "Forbidden" });
    }
  } catch (error) {
    // Handle internal server error
    res.status(400).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    // Implement login logic here
    const adminuser = await Adminuser.findOne({ username: req.body.username });

    // For demonstration, let's assume we fetch instance details and occupied space from the database
    const token = jwt.sign({ _id: adminuser._id }, "process.env.JWT_SECRET", {
      expiresIn: "15d",
    });
    if (adminuser && adminuser.password == req.body.password) {
      res.status(200).json({ token });
    } else {
      res.status(204).json({ message: "Unauthenticated User" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const authenticateAdminUser = async (req, res, next) => {
  try {
    // Implement authentication logic here
    const token = req.body.token;
    console.log(token);
    if (token) {
      const decoded = await jwt.verify(
        token.substring(6),
        "process.env.JWT_SECRET"
      );
      const newuser = await Adminuser.findById(decoded._id);
      console.log(newuser);
      req.body.user = newuser;
      next();
    } else {
      res.status(204).json({
        success: false,
        message: "not logged in",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Createinstance = async (req, res) => {
  try {
    // Create new instance with data from req.body
    const adminuser = await Adminuser.findOne({
      username: req.body.username,
      password: req.body.password,
    });
    if (!adminuser || req.body.user.username != adminuser.username) {
      return res.send(205).json({ message: "Action Forbidden" });
    } else {
      const newInstance = new Instance({
        instanceId: req.body.instanceId,
        createdDate: new Date(),
        lastModifiedDate: new Date(),
        occupiedSpace: 0, // Initially set occupied space to 0
        databases: [], // Initially, the database section will be empty
      });

      // Save instance details to database
      await newInstance.save();

      res.status(200).json({ message: "Instance created successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Getinstances = async (req, res) => {
  try {
    const instances = await Instance.find({});
    res.status(200).json(instances);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const Getoneinstance = async (req, res) => {
  try {
    const instance = await Instance.findOne({instanceId: req.body.instanceId});
    console.log(req.body.instanceId)
    res.status(200).json(instance);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Deleteinstance = async (req, res) => {
  try {
    // Check if instanceId is provided in the request body
    if (!req.body.instanceId) {
      return res.status(400).json({ message: "Instance ID is required" });
    }

    // Find instance by ID and delete it
    const deletedInstance = await Instance.findByIdAndDelete(
      req.body.instanceId
    );
    if (!deletedInstance) {
      return res.status(404).json({ message: "Instance not found" });
    }

    res.status(200).json({ message: "Instance deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Createdatabase = async (req, res) => {
  try {
    const adminuser = await Adminuser.findOne({
      username: req.body.username,
      password: req.body.password,
    });
    if (!adminuser || req.body.user.username != adminuser.username) {
      console.log(adminuser);
      return res.send(205).json({ message: "Action Forbidden" });
    } else {
      // Check if instanceId is provided in the request body

      if (!req.body.instanceId) {
        console.log("give id")
        return res.status(400).json({ message: "Instance ID is required" });
      }

      // Check if instance exists
      const instance = await Instance.findById(req.body.instanceId);
      if (!instance) {
        console.log(instance)
        return res.status(404).json({ message: "Instance not found" });
      }
      // Create new database under instance
      const newDatabase = { databaseId: req.body.databaseId, users: [] };
      // instance.lastModifiedDate = Date.now;
      instance.databases.push(newDatabase);
      await instance.save();

      res.status(200).json({ message: "Database created successfully" });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Deletedatabase = async (req, res) => {
  try {
    // Check if instanceId and databaseId are provided in the request body
    if (!req.body.instanceId || !req.body.databaseId) {
      return res
        .status(400)
        .json({ message: "Instance ID and Database ID are required" });
    }

    // Find instance by ID
    const instance = await Instance.findById(req.body.instanceId);
    if (!instance) {
      return res.status(404).json({ message: "Instance not found" });
    }

    // Find database index in the instance
    const databaseIndex = instance.databases.findIndex(
      (db) => db._id === req.body.databaseId
    );
    if (databaseIndex === -1) {
      return res.status(404).json({ message: "Database not found" });
    }

    // Remove database from the instance
    instance.databases.splice(databaseIndex, 1);
    instance.lastModifiedDate = Date.now;
    await instance.save();

    res.status(200).json({ message: "Database deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Createusers = async (req, res) => {
  try {
    // Check if instanceId and databaseId are provided in the request body
    if (!req.body.instanceId || !req.body.databaseId) {
      return res
        .status(400)
        .json({ message: "Instance ID and Database ID are required" });
    }

    // Find instance by ID
    const instance = await Instance.findById(req.body.instanceId);
    if (!instance) {
      return res.status(404).json({ message: "Instance not found" });
    }

    // Find database in the instance
    const database = instance.databases.find(
      (db) => db._id === req.body.databaseId
    );
    if (!database) {
      return res.status(404).json({ message: "Database not found" });
    }

    // Create new user under database
    const newUser = {
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      permission: req.body.permission,
    };
    database.lastModifiedDate = Date.now;
    database.users.push(newUser);
    instance.lastModifiedDate = Date.now;
    await instance.save();

    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


export const  Getusers = async (req, res) => {
  try {
    // Check if instanceId and databaseId are provided in the request body
    if (!req.body.instanceId || !req.body.databaseId) {
      return res
        .status(400)
        .json({ message: "Instance ID and Database ID are required" });
    }

    // Find instance by ID
    const instance = await Instance.findById(req.body.instanceId);
    if (!instance) {
      return res.status(404).json({ message: "Instance not found" });
    }

    // Find database in the instance
    const database = instance.databases.find(
      (db) => db._id === req.body.databaseId
    );
    if (!database) {
      return res.status(404).json({ message: "Database not found" });
    }

    // Create new user under database
    const newUser = {
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      permission: req.body.permission,
    };
    database.lastModifiedDate = Date.now;
    database.users.push(newUser);
    instance.lastModifiedDate = Date.now;
    await instance.save();

    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const DeleteUser = async (req, res) => {
  try {
    // Check if instanceId, databaseId, and userId are provided in the request body
    if (!req.body.instanceId || !req.body.databaseId || !req.body.userId) {
      return res.status(400).json({
        message: "Instance ID, Database ID, and User ID are required",
      });
    }

    // Find instance by ID
    const instance = await Instance.findById(req.body.instanceId);
    if (!instance) {
      return res.status(404).json({ message: "Instance not found" });
    }

    // Find database in the instance
    const database = instance.databases.find(
      (db) => db._id === req.body.databaseId
    );
    if (!database) {
      return res.status(404).json({ message: "Database not found" });
    }

    // Find user index in the database
    const userIndex = database.users.findIndex(
      (user) => user._id === req.body.userId
    );
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove user from the database
    database.users.splice(userIndex, 1);
    database.lastModifiedDate = Date.now;
    instance.lastModifiedDate = Date.now;
    await instance.save();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const ChangePassword = async (req, res) => {
  try {
    // Check if instanceId, databaseId, and userId are provided in the request body
    if (!req.body.instanceId || !req.body.databaseId || !req.body.userId) {
      return res.status(400).json({
        message: "Instance ID, Database ID, and User ID are required",
      });
    }

    // Find instance by ID
    const instance = await Instance.findById(req.body.instanceId);
    if (!instance) {
      return res.status(404).json({ message: "Instance not found" });
    }

    // Find database in the instance
    const database = instance.databases.find(
      (db) => db._id === req.body.databaseId
    );
    if (!database) {
      return res.status(404).json({ message: "Database not found" });
    }

    // Find user in the database
    const user = database.users.find((user) => user._id === req.body.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user password
    user.password = req.body.newPassword;
    database.lastModifiedDate = Date.now;
    instance.lastModifiedDate = Date.now;
    await instance.save();

    res.status(200).json({ message: "User password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
