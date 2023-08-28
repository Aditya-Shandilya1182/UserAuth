import express from 'express';
import UserController from '../controllers/userController.js';
import authenticateUser from '../middlewares/auth-middleware.js';

const router = express.Router();


router.use('/loggeduser', authenticateUser);

// Public Routes
router.post('/register', UserController.userRegistration);
router.post('/login', UserController.userLogin);

// Protected Routes

router.get('/loggeduser', UserController.loggedUser);

export default router;
