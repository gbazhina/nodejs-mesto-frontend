import { Router } from "express";
import { getCards, deleteCardId, createCard } from "../controllers/cards";

const router = Router();

// Настройка путей в соответствии со спецификацией задания
router.get("/", getCards);
router.post("/", createCard);
router.delete("/:userId", deleteCardId);

export default router;
