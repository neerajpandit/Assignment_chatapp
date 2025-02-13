import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  loginUser,
  logoutUser,
  updateUser,
} from "../controllers/userController.js";
import {
  validateLogin,
  validateRegistration,
} from "../middlewares/inputValidator.js";
import { verifyToken } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/", validateRegistration, createUser);
router.post("/login", validateLogin, loginUser);
router.post("/logout", verifyToken, logoutUser);
router.get("/", verifyToken,  getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, updateUser);


export default router;
