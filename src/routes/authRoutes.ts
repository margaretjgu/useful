import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { User } from '../models/user';

// Define a rate limit rule for the login route
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // limit to 5 requests per windowMs
  handler: (req, res) => {
    res.status(429).json({
      message: "Too many login attempts, please try again later."
    });
  }
});

interface FailedLoginAttempts {
    [key: string]: number;
  }
  
// Initialize the object for tracking login attempts
const failedLoginAttempts: FailedLoginAttempts = {}; // Should be in persistent storage redis

const router = express.Router();

// Apply the rate limit to the login route
router.post('/login', loginRateLimiter, async (req, res) => {
  const { email, password } = req.body;

  // Check if account is locked
  if (failedLoginAttempts[email] && failedLoginAttempts[email] > 3) {
    return res.status(401).json({
      message: "Account locked due to too many failed login attempts. Please try again later."
    });
  }

  try {
    const user = await User.findOneByEmail(email);
    if (!user) {
      // Increment failed login attempt
      failedLoginAttempts[email] = (failedLoginAttempts[email] || 0) + 1;
      return res.status(401).send('Authentication failed.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment failed login attempt
      failedLoginAttempts[email] = (failedLoginAttempts[email] || 0) + 1;
      return res.status(401).send('Authentication failed.');
    }

    // Reset failed login attempt on success
    failedLoginAttempts[email] = 0;

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

export default router;
