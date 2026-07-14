import { Request, Response, NextFunction } from "express";
import Card from "../models/card";
import mongoose from "mongoose";

// GET /cards — возвращает все карточки
export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const cards = await Card.find({}).populate("owner", "name about avatar");
    res.status(200).json(cards);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка", error: error.message });
  }
};

// POST /cards — создаёт карточку
export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, link } = req.body;

    if (!name || !link) {
      res.status(400).json({
        message: "Переданы некорректные данные при создании карточки",
      });
      return;
    }

    const user = (res.locals as any).user;

    if (!user || !user._id) {
      res.status(500).json({
        message: "На сервере произошла ошибка",
        error: "Пользователь не найден в контексте запроса",
      });
      return;
    }

    const ownerId = new mongoose.Types.ObjectId(user._id);

    const newCard = new Card({
      name,
      link,
      owner: ownerId,
    });

    await newCard.save();
    res.status(201).json(newCard);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      res
        .status(400)
        .json({ message: "Ошибка валидации данных", error: error.message });
      return;
    }
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка", error: error.message });
  }
};

// DELETE /cards/:cardId — удаляет карточку
export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId);

    if (!card) {
      res.status(404).json({ message: "Карточка с указанным _id не найдена" });
      return;
    }

    res.status(200).json({ message: "Карточка удалена" });
  } catch (error: any) {
    if (error.name === "CastError") {
      res.status(400).json({ message: "Передан некорректный id карточки" });
      return;
    }
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка", error: error.message });
  }
};

// PUT /cards/:cardId/likes — поставить лайк карточке
export const likeCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { cardId } = req.params;
    const userId = new mongoose.Types.ObjectId((res.locals as any).user._id);

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!card) {
      res.status(404).json({ message: "Карточка с указанным _id не найдена" });
      return;
    }

    res.status(200).json(card);
  } catch (error: any) {
    if (error.name === "CastError") {
      res.status(400).json({ message: "Передан некорректный id карточки" });
      return;
    }
    res.status(500).json({ message: "На сервере произошла ошибка", error: error.message });
  }
};

// DELETE /cards/:cardId/likes — убрать лайк с карточки
export const dislikeCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { cardId } = req.params;
    const userId = new mongoose.Types.ObjectId((res.locals as any).user._id);

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!card) {
      res.status(404).json({ message: "Карточка с указанным _id не найдена" });
      return;
    }

    res.status(200).json(card);
  } catch (error: any) {
    if (error.name === "CastError") {
      res.status(400).json({ message: "Передан некорректный id карточки" });
      return;
    }
    res.status(500).json({ message: "На сервере произошла ошибка", error: error.message });
  }
};