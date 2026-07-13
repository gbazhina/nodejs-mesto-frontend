import { Request, Response, NextFunction } from "express";
import Card from "../models/card";

// GET /cards — возвращает все карточки
export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const cards = await Card.find({});
    res.status(200).json(cards);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка", error: error.message });
  }
};

// DELETE /cards/:userId — удаляет карточку по _id
export const deleteCardId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      res
        .status(404)
        .json({ message: "Карточка с указанным _id не найдена" });
      return;
    }

    res.status(200).json(card);
  } catch (error: any) {
    // Если передан некорректный ID (например, слишком короткая строка) Mongoose выбросит CastError
    if (error.name === "CastError") {
      res.status(400).json({ message: "Передан некорректный id карточки" });
      return;
    }
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

    // Базовая проверка наличия всех трех обязательных полей в JSON
    if (!name || !link) {
      res.status(400).json({
        message: "Переданы некорректные данные при создании карточки",
      });
      return;
    }

    const newCard = new Card({ name, link });
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
