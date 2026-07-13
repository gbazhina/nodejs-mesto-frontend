import { Schema, model, Document } from "mongoose";

// Интерфейс пользователя для TypeScript
export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
}

// Схема пользователя с валидацией
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
  },
});

// Создание и экспорт модели
export default model<IUser>("user", userSchema);