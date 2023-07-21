import { Request, Response } from 'express';
import catchAsync from '../shared/catchAsync';
import sendResponse from '../shared/sendResponse';
import httpStatus from 'http-status';
import { AuthService } from './auth.service';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUser(loginData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User loggedin successfully',
    data: result,
  });
});

export const AuthController = {
  loginUser,
};