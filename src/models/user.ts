import { URL_REGEX } from "const";
import { Schema, model, Document } from "mongoose";
/* eslint-disable import/no-extraneous-dependencies */
import validator from "validator";
/* eslint-enable import/no-extraneous-dependencies */

// Интерфейс пользователя для TypeScript
export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

// Схема пользователя с валидацией
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: "Исследователь",
  },
  avatar: {
    type: String,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    validate: {
      validator: (value: string) => URL_REGEX.test(value),
      message: "Некорректный формат ссылки на аватар",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: "Некорректный формат email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// Создание и экспорт модели
export default model<IUser>("user", userSchema);