import express from 'express';
import { CowController } from './cow.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CowValidation } from './cow.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.SELLER),
  validateRequest(CowValidation.createCowZodSchema),
  CowController.createCow
);
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  CowController.getSingleCow
);
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  CowController.getAllCows
);
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SELLER),
  validateRequest(CowValidation.updatedCowZodSchema),
  CowController.updateCow
);
router.delete('/:id', auth(ENUM_USER_ROLE.SELLER), CowController.deleteCow);

export const CowRoutes = router;
