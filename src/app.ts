import { webcrypto } from "node:crypto";
import express, { Application, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import userRouter from "./routes/users";
import cardsRouter from "./routes/cards";

// Полифил для глобального crypto (Mongoose использует его для генерации ObjectId)
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

    // 1. JSON-парсер — первым
    app.use(express.json());

    // 2. Мидлвар с user — ВТОРЫМ, ПЕРЕД ВСЕМИ роутами
    app.use((req: Request, res: Response, next: NextFunction) => {
      res.locals.user = { _id: "6a55f044f50ff10b98addf21" };
      next();
    });

    // 3. Все роуты ПОСЛЕ мидлвара
    app.get("/", (req: Request, res: Response) => {
      res.send("Сервер работает и подключен к MongoDB!");
    });

    app.use("/users", userRouter);
    app.use("/cards", cardsRouter);

    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка при запуске сервера или подключении к БД:", error);
    process.exit(1);
  }
}

startServer();
