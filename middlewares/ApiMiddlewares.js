import { DatabaseModel } from "../models/DatabaseModel.js";
import { ModalModel } from "../models/ModalModel.js";
import { UserModel } from "../models/UserModel.js";

export const apiSecretMiddleware = async (req, res, next) => {
  const API_SECRET_KEY = req.params.API_SECRET_KEY;

  const foundUser = await UserModel.findOne({ API_SECRET_KEY: API_SECRET_KEY });
  if (foundUser) {
    if (foundUser.isPrimeUser || Date.now() - foundUser.lastApiHit >= 2000) {
      req.body.user = foundUser;
      next();
    } else {
      // Send 429 Too Many Requests if the user has exceeded the rate limit
      res.status(429).json({
        success: false,
        msg: "Tried to access the service more frequently. Either get Premium or wait and try again later!",
      });
    }
  } else {
    // Send 401 Unauthorized if the API secret key is invalid
    res
      .status(401)
      .json({ error: "Unauthorized", msg: "Invalid API Secret Key" });
  }
};

export const createDbMiddleware = async (req, res, next) => {
  const DB_NAME = req.params.DB_NAME;
  const exists = req.body?.user?.Databases_names?.some(
    (value) => value === DB_NAME
  );

  if (exists) {
    // If the database name already exists, send a response indicating the error and end the process
    return res.status(409).json({
      success: false,
      msg: "Same Database Name Already Assigned to you",
    });
  }

  next();
};
export const checkDbMiddleware = async (req, res, next) => {
  const DB_NAME = await req.params.DB_NAME; // Define DB_NAME here
  // Iterate over the database names asynchronously
  for (const value of req.body.user.Databases_names) {
    if (value == DB_NAME) {
      // Find the specific database
      const specificDb = await DatabaseModel.findOne({
        Name: DB_NAME,
        UserEmail: req.body.user.Email,
      });
      if (specificDb) {
        // Assign the specific database to req.body.db
        req.body.db = specificDb;
        return next(); // Exit the loop and continue to the next middleware
      }
    }
  }

  // If no matching database is found, return a 404 response
  return res.status(404).json({
    success: false,
    msg: "Database Name Does Not Found! Please first create or check the name",
  });
};


export const createModalMiddleware = async (req, res, next) => {
  const MODAL_NAME = req.params.MODAL_NAME;
  // Iterate over the database names asynchronously
  for (const value of req.body.db.Modal_names) {
    if (value === MODAL_NAME) {
      // Find the specific database
      console.log(value);
      return res.status(409).json({"success": false,"msg": "Same Modal Name Already Assigned to this Database"})
    }
  }

  next();
};

export const checkModalMiddleware = async (req, res, next) => {
  const MODAL_NAME = req.params.MODAL_NAME;

  for (const value of req.body.db.Modal_names) {
    if (value === MODAL_NAME) {
      // Find the specific database
      const thisModal = await ModalModel.findOne({Name:MODAL_NAME});
      req.body.modal= thisModal;
      return next();
    }
  }

  return res.status(404).json({
    success: false,
    msg: "Modal Name Does Not Found! Please first create or check the name",
  });
};
