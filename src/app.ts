import { webcrypto } from "node:crypto";
import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import { errors } from "celebrate";
import userRouter from "./routes/users";
import cardsRouter from "./routes/cards";
import login from "./controllers/login";
import { createUser } from "./controllers/users";
import auth from "./middlewares/auth";
import { requestLogger, errorLogger } from "./middlewares/logger";
import errorHandler from "./middlewares/error-handler";
import { NotFoundError } from "./errors";
import { validateLogin, validateCreateUser } from "./validators";

if (!globalThis.crypto) {
  (globalThis as any).crypto = webcrypto;
}

const app: Application = express();
const PORT: number = 3000;
const DB_URL: string = "mongodb://localhost:27017/mestodb";

async function startServer() {
  try {
    await mongoose.connect(DB_URL);
    console.log("Успешное подключение к базе данных MongoDB");

    app.use(express.json());

    app.use(requestLogger);

    // Публичные роуты с валидацией
    app.post("/signin", validateLogin, login);
    app.post("/signup", validateCreateUser, createUser);

    // Защищённые роуты
    app.use(auth);
    app.use("/users", userRouter);
    app.use("/cards", cardsRouter);

    app.use((req: Request, res: Response, next) => {
      next(new NotFoundError("Ресурс не найден"));
    });

    app.use(errorLogger);

    // Обработчик ошибок celebrate — перед централизованным!
    app.use(errors());

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка при запуске сервера:", error);
    process.exit(1);
  }
}

startServer();
