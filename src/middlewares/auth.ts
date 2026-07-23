import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors";

const { JWT_SECRET = "super-strong-secret" } = process.env;

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { _id: string };
    }
  }
}

const auth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new UnauthorizedError();
    }

    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = payload as any;
    next();
  } catch (err) {
    next(new UnauthorizedError());
  }
};

export default auth;
