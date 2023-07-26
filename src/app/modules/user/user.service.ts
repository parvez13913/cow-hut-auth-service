/* eslint-disable @typescript-eslint/no-explicit-any */
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { JwtHelpers } from '../../../helpers/jwtHelpers';
import { IProfile, IUser } from './user.interface';
import { User } from './user.model';
import bcrypt from 'bcrypt';
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
  const isExist = await User.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const { name, ...userData } = payload;

  const updateUserData: Partial<IUser> = { ...userData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser>;
      (updateUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await User.findOneAndUpdate({ _id: id }, updateUserData, {
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

const updateMyProfile = async (
  payload: Partial<IUser>,
  token: string
): Promise<IProfile> => {
  const isValidUser = JwtHelpers.verifiedToken(
    token,
    config.jwt.secret as Secret
  );

  if (!isValidUser) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }
  const isExist = await User.findOne({ _id: isValidUser?.userId });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const { name, password, ...updateData } = payload;
  const updateProfileData: Partial<IUser> = { ...updateData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser>;

      (updateProfileData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_rounds)
    );
    updateProfileData.password = hashedPassword;
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: isValidUser?.userId },
    updateProfileData,
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(400, 'jdkjksj');
  }

  const result = {
    name: updatedUser.name,
    phoneNumber: updatedUser.phoneNumber,
    address: updatedUser.address,
  };

  return result;
};

export const UserService = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
};
