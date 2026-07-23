import { Router } from "express";
import {
  getUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} from "../controllers/users";
import {
  validateGetUserById,
  validateUpdateProfile,
  validateUpdateAvatar,
} from "../validators";

const router = Router();

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.get("/:userId", validateGetUserById, getUserById);
router.patch("/me", validateUpdateProfile, updateProfile);
router.patch("/me/avatar", validateUpdateAvatar, updateAvatar);

export default router;
