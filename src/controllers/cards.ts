import { Request, Response, NextFunction } from "express";
import Card from "../models/card";
import { NotFoundError, ForbiddenError, BadRequestError } from "../errors";
import { Schema } from "mongoose";

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const cards = await Card.find({});
    res.status(200).json(cards);
  } catch (err) {
    next(err);
  }
};

export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, link } = req.body;

    const card = await Card.create({
      name,
      link,
      owner: req.user?._id as unknown as Schema.Types.ObjectId,
    });

    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
};

export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { cardId } = req.params;

    const card = await Card.findById(cardId);

    if (!card) {
      throw new NotFoundError("Карточка не найдена");
    }

    if (card.owner.toString() !== req.user?._id) {
      throw new ForbiddenError("Недостаточно прав для удаления карточки");
    }

    await Card.findByIdAndDelete(cardId);
    res.status(200).json({ message: "Карточка удалена" });
  } catch (err) {
    next(err);
  }
};

export const likeCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError("Карточка не найдена");
    }

    res.status(200).json(card);
  } catch (err) {
    next(err);
  }
};

export const dislikeCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError("Карточка не найдена");
    }

    res.status(200).json(card);
  } catch (err) {
    next(err);
  }
};
