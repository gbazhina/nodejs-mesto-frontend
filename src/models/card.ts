import { URL_REGEX } from "../const";
import { Schema, model, Document } from "mongoose";

// Интерфейс карточки для TypeScript
export interface ICard extends Document {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  createdAt: Date;
}

// Схема карточки с валидацией
const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => URL_REGEX.test(value),
      message: "Некорректный формат ссылки",
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: "user",
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Создание и экспорт модели
export default model<ICard>("card", cardSchema);
