import { Request, Response, NextFunction } from "express";
import User from "../models/user";

// GET /users — возвращает всех пользователей
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка", error: error.message });
  }
};

// GET /users/:userId — возвращает пользователя по _id
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      res
        .status(404)
        .json({ message: "Пользователь с указанным _id не найден" });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    // Если передан некорректный ID (например, слишком короткая строка) Mongoose выбросит CastError
    if (error.name === "CastError") {
      res.status(400).json({ message: "Передан некорректный id пользователя" });
      return;
    }
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка", error: error.message });
  }
};

// POST /users — создаёт пользователя
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, about, avatar } = req.body;

    // Базовая проверка наличия всех трех обязательных полей в JSON
    if (!name || !about || !avatar) {
      res.status(400).json({
        message: "Переданы некорректные данные при создании пользователя",
      });
      return;
    }

    const newUser = new User({ name, about, avatar });
    await newUser.save();

    res.status(201).json(newUser);
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
