import { Router } from "express";
import { getUsers, getUserById, createUser } from "../controllers/users";

const router = Router();

// Настройка путей в соответствии со спецификацией задания
router.get("/", getUsers);
router.post("/", createUser);
router.get("/:userId", getUserById);

export default router;
