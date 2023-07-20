import { Request, Response } from 'express';
import catchAsync from '../shared/catchAsync';
import sendResponse from '../shared/sendResponse';
import { IAdmin } from './admin.interface';
import httpStatus from 'http-status';
import { AdminService } from './admin.service';

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...adminData } = req.body;
  const result = await AdminService.createAdmin(adminData);

  sendResponse<IAdmin>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin created successfully',
    data: result,
  });
});

export const AdminController = {
  createAdmin,
};
