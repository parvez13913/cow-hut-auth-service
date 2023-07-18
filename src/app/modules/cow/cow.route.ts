import express from 'express';
import { CowController } from './cow.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CowValidation } from './cow.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(CowValidation.createCowZodSchema),
  CowController.createCow
);
router.get('/:id', CowController.getSingleCow);
router.get('/', CowController.getAllCows);
router.patch(
  '/:id',
  validateRequest(CowValidation.updatedCowZodSchema),
  CowController.updateCow
);
router.delete('/:id', CowController.deleteCow);

export const CowRouter = router;
