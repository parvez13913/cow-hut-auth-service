import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { JwtHelpers } from '../../../helpers/jwtHelpers';
import { IProfile, IUser } from './user.interface';
import { User } from './user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const getAllUsers = async (): Promise<IUser[]> => {
  const result = await User.find();
  return result;
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const result = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

const getMyProfile = async (token: string): Promise<IProfile> => {
  const isValidUser = JwtHelpers.verifiedToken(
    token,
    config.jwt.secret as Secret
  );

  const { userId } = isValidUser;
  const profileInfo = await User.findById({ _id: userId });

  if (!profileInfo?.role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not Found');
  }

  const { name, phoneNumber, address } = profileInfo;
  const result = {
    name,
    phoneNumber,
    address,
  };

  return result;
};

export const UserService = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getMyProfile,
};
