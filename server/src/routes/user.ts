// src/routes/user.ts
import express from 'express';
import { UserController } from '../controllers/userController';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth, UserController.getUser);
router.put('/', auth, UserController.updateUser);

export default router;