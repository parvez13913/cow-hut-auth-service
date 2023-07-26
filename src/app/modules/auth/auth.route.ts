import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { UserValidation } from '../user/user.validation';
// import { AdminController } from '../admin/admin.controller';
// import { AdminValidation } from '../admin/admin.validation';

const router = express.Router();
// create user route
router.post(
  '/signup',
  validateRequest(UserValidation.createUserZodSchema),
  AuthController.createUser
);

//user login route
router.post(
  '/login',
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);

export const AuthRoutes = router;
