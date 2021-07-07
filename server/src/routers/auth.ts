import express from 'express';
import {
  registerUser,
  loginUser,
  users,
  removeUser
} from '../controllers/auth';

const { Router } = express;
const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', users);
router.delete('/:id', removeUser);

export default router;
