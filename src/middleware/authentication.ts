import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
      interface Request {
        userData?: { email: string };
      }
    }
}

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) throw new Error('Auth token is not provided');
  
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
      }
      
      const decodedToken = jwt.verify(token, secret) as { userId: string }; // Assuming the payload has a 'userId' field
      req.userData = { email: decodedToken.userId };
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
  };