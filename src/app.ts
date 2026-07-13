import { webcrypto } from "node:crypto";

// Полифил для глобального crypto (Mongoose использует его для генерации ObjectId)
if (!globalThis.crypto) {
  (globalThis as any).crypto = webcrypto;
}

import express, { Application, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import userRouter from "./routes/users";

const app: Application = express();
const PORT: number = 3000;
const DB_URL: string = "mongodb://localhost:27017/mestodb";

async function startServer() {
  try {
    // 1. Подключаемся к MongoDB
    await mongoose.connect(DB_URL);
    console.log("Успешное подключение к базе данных MongoDB");

    // 2. Обязательный мидлвар для чтения JSON в POST-запросах (СТРОГО перед роутами)
    app.use(express.json());

    // 3. Тестовый корневой роут
    app.get("/", (req: Request, res: Response) => {
      res.send("Сервер работает и подключен к MongoDB!");
    });

    // 4. Монтируем роутер пользователей
    app.use("/users", userRouter);

    // app.use((req: Request, res: Response, next: NextFunction) => {
    //   req.user = {
    //     _id: "6a5504f285cb404c7f78bf41", // вставьте сюда _id созданного в предыдущем пункте пользователя
    //   };

    //   next();
    // });

    // 5. И только теперь запускаем сервер на прослушивание портов
    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка при запуске сервера или подключении к БД:", error);
    process.exit(1);
  }
}

// Запускаем инициализацию всей цепочки
startServer();
