import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express'

const config = process.env;

export default (req: Request, res: Response, next: NextFunction) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).json({ message: "A token is required for authentication" });
  }
  try {
    jwt.verify(token, config.TOKEN_KEY);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
  return next();
};

