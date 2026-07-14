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

// PATCH /users/me — обновляет профиль
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, about } = req.body;
    const userId = (res.locals as any).user._id;

    if (!name && !about) {
      res.status(400).json({
        message: "Переданы некорректные данные при обновлении профиля",
      });
      return;
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (about) updateData.about = about;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({ message: "Пользователь с указанным _id не найден" });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      res.status(400).json({ message: "Ошибка валидации данных", error: error.message });
      return;
    }
    if (error.name === "CastError") {
      res.status(400).json({ message: "Передан некорректный id пользователя" });
      return;
    }
    res.status(500).json({ message: "На сервере произошла ошибка", error: error.message });
  }
};

// PATCH /users/me/avatar — обновляет аватар
export const updateAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { avatar } = req.body;
    const userId = (res.locals as any).user._id;

    if (!avatar) {
      res.status(400).json({
        message: "Переданы некорректные данные при обновлении аватара",
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({ message: "Пользователь с указанным _id не найден" });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      res.status(400).json({ message: "Ошибка валидации данных", error: error.message });
      return;
    }
    if (error.name === "CastError") {
      res.status(400).json({ message: "Передан некорректный id пользователя" });
      return;
    }
    res.status(500).json({ message: "На сервере произошла ошибка", error: error.message });
  }
};