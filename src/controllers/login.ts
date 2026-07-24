import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { UnauthorizedError, BadRequestError } from "../errors";

const { JWT_SECRET = "super-strong-secret" } = process.env;

const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Не передан email или пароль");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new UnauthorizedError("Неправильные почта или пароль");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedError("Неправильные почта или пароль");
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

export default login;
