import { IOrder } from './order.interface';
import { User } from '../user/user.model';
import { Cow } from '../cow/cow.model';
import ApiError from '../../../errors/ApiError';
import mongoose from 'mongoose';
import { Order } from './order.model';
import { JwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import httpStatus from 'http-status';

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

    const newOrder = await (
      await (
        await Order.create({ cow, buyer })
      ).populate({
        path: 'cow',
        populate: [
          {
            path: 'seller',
          },
        ],
      })
    ).populate('buyer');
    await session.commitTransaction();
    await session.endSession();
    return newOrder;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const getAllOrders = async (token: string): Promise<IOrder[]> => {
  const isValidUser = JwtHelpers.verifiedToken(
    token,
    config.jwt.secret as Secret
  );
  const { role, userId } = isValidUser;
  if (role === 'admin') {
    const allOrders = await Order.find({})
      .populate({
        path: 'cow',
        populate: [
          {
            path: 'seller',
          },
        ],
      })
      .populate('buyer');
    return allOrders;
  } else if (role === 'buyer') {
    const buyerOrders = await Order.find({ buyer: userId })
      .populate({
        path: 'cow',
        populate: [
          {
            path: 'seller',
          },
        ],
      })
      .populate('buyer');
    return buyerOrders;
  } else if (role === 'seller') {
    const sellerOrders = await Order.find({ seller: userId })
      .populate({
        path: 'cow',
        populate: [
          {
            path: 'seller',
          },
        ],
      })
      .populate('buyer');
    return sellerOrders;
  } else {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden..');
  }
};

const getSingleOrder = async (
  id: string,
  token: string
): Promise<IOrder | null> => {
  const verifiedOrder = JwtHelpers.verifiedToken(
    token,
    config.jwt.secret as Secret
  );
  if (!verifiedOrder) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }
  const isExist = await Order.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order does not exist !');
  }

  const { userId, role } = verifiedOrder;
  let result = null;
  if (role === 'admin') {
    result = await Order.findById(id)
      .populate({
        path: 'cow',
        populate: [
          {
            path: 'seller',
          },
        ],
      })
      .populate('buyer');
  } else if (role === 'buyer') {
    result = await Order.findOne({ buyer: userId })
      .populate({
        path: 'cow',
        populate: [
          {
            path: 'seller',
          },
        ],
      })
      .populate('buyer');
  } else if (role === 'seller') {
    const order = await Order.findOne({ _id: id });
    const cow = await Cow.findOne({ _id: order?.cow });
    const seller = await User.findOne({ _id: cow?.seller });

    if (userId === seller?._id.toString()) {
      result = await Order.findOne({ _id: id })
        .populate({
          path: 'cow',
          populate: [
            {
              path: 'seller',
            },
          ],
        })
        .populate('buyer');
    } else {
      result = null;
    }
  } else {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden..');
  }

  return result;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
};
