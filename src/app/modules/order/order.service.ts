import { IOrder } from './order.interface';
import { User } from '../user/user.model';
import { Cow } from '../cow/cow.model';
import ApiError from '../../../errors/ApiError';
import mongoose from 'mongoose';
import { Order } from './order.model';

const createOrder = async (
  cow: string,
  buyer: string
): Promise<IOrder | null> => {
  // check if the user and cow IDs are valid
  const isValidUser = await User.findById(buyer);
  const isValidCow = await Cow.findById(cow);
  if (!isValidUser) {
    throw new ApiError(404, 'Invalid user id');
  }
  if (!isValidCow) {
    throw new ApiError(404, 'Invalid cow id');
  }

  // check if the user has enough money to buy the cow

  if (isValidUser.budget < isValidCow.price) {
    throw new ApiError(400, 'Insufficient Balance');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // update label
    await Cow.findByIdAndUpdate(cow, { label: 'sold out' });

    await User.findByIdAndUpdate(buyer, {
      $inc: { budget: -isValidCow.price },
    });

    await User.findByIdAndUpdate(isValidCow.seller, {
      $inc: { income: isValidCow.price },
    });

    const newOrder = (await Order.create({ cow, buyer })).populate(
      'cow',
      'user'
    );
    await session.commitTransaction();
    await session.endSession();
    return newOrder;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const getAllOrders = async (): Promise<IOrder[]> => {
  const result = await Order.find();

  return result;
};
export const OrderService = {
  createOrder,
  getAllOrders,
};
