import express, { Application, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

const app: Application = express();
const PORT: number = 3000;
const DB_URL: string = "mongodb://localhost:27017/mestodb";

// Функция для подключения к базе данных и запуска сервера
async function startServer() {
  try {
    // Подключаемся к MongoDB
    await mongoose.connect(DB_URL);
    console.log("Успешное подключение к базе данных MongoDB");

    // Настройка роутов
    app.get("/", (req: Request, res: Response) => {
      res.send("Сервер работает и подключен к MongoDB!");
    });

    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка при запуске сервера или подключении к БД:", error);
    process.exit(1); // Завершаем процесс в случае критической ошибки
  }
}

startServer();

// app.use((req: Request, res: Response, next: NextFunction) => {
//   req.user = {
//     _id: "5d8b8592978f8bd833ca8133", // вставьте сюда _id созданного в предыдущем пункте пользователя
//   };

//   next();
// });