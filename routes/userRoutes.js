import express from 'express';
const router = express.Router();
import UserController from '../controllers/userController.js';
import authenticateUser from '../middlewares/auth-middleware.js';

router.use('/changepassword', authenticateUser);
router.use('/loggeduser', authenticateUser);

// Public Routes
router.post('/register', UserController.userRegistration);
router.post('/login', UserController.userLogin);

// Protected Routes
router.post('/changepassword', UserController.changeUserPassword);
router.get('/loggeduser', UserController.loggedUser);


export default router;