import { Router } from "express";
import auth from "../middlewares/auth";
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from "../controllers/cards";
import { validateCreateCard, validateCardId } from "../validators";

const router = Router();

router.use(auth);

router.get("/", getCards);
router.post("/", validateCreateCard, createCard);
router.delete("/:cardId", validateCardId, deleteCard);
router.put("/:cardId/likes", validateCardId, likeCard);
router.delete("/:cardId/likes", validateCardId, dislikeCard);

export default router;
