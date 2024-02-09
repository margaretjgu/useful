import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user in DynamoDB
  try {
    await User.create(email, hashedPassword, username);
    res.status(201).send('User created successfully.');
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOneByEmail(email);
    if (!user) {
      return res.status(401).send('Authentication failed.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Authentication failed.');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
    throw new Error('Environment variable JWT_SECRET must be set');
    }
    const token = jwt.sign({ userId: user.email }, secret, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

export default router;
