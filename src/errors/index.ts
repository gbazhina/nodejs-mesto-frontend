export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string = "Переданы некорректные данные") {
    super(message, 400);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = "Необходима авторизация") {
    super(message, 401);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = "Недостаточно прав") {
    super(message, 403);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = "Ресурс не найден") {
    super(message, 404);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = "Пользователь с таким email уже существует") {
    super(message, 409);
  }
}
