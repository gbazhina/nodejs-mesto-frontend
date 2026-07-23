import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors";

const errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  // Ошибка дубликата MongoDB (unique: true)
  if ((err as any).code === 11000) {
    res
      .status(409)
      .json({ message: "Пользователь с таким email уже существует" });
    return;
  }

  // Ошибка валидации Mongoose
  if (err.name === "ValidationError") {
    res.status(400).json({ message: "Переданы некорректные данные" });
    return;
  }

  // Ошибка CastError (невалидный ObjectId)
  if (err.name === "CastError") {
    res.status(400).json({ message: "Переданы некорректные данные" });
    return;
  }

  // Непредвиденная ошибка — 500
  res.status(500).json({ message: "На сервере произошла ошибка" });
};

export default errorHandler;
