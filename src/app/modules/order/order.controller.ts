import { Request, Response } from 'express';
import catchAsync from '../shared/catchAsync';
import sendResponse from '../shared/sendResponse';
import { IOrder } from './order.interface';
import httpStatus from 'http-status';
import { OrderService } from './order.service';
import ApiError from '../../../errors/ApiError';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { cow, buyer } = req.body;

  const result = await OrderService.createOrder(cow, buyer);

  sendResponse<IOrder>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order Created Successfully',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }
  const result = await OrderService.getAllOrders(token);

  sendResponse<IOrder[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
};
