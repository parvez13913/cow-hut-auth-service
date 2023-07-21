/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type UserName = {
  firstName: string;
  lastName: string;
};

export type IUser = {
  password: string;
  role: 'buyer' | 'seller';
  name: UserName;
  phoneNumber: string;
  address: string;
  budget: number;
  income: number;
};

export type UserModel = {
  isUserExist(
    phoneNumber: string
  ): Promise<Pick<IUser, 'password' | 'role' | 'phoneNumber'> | null>;
  isPasswordMatched(
    givenPassword: string,
    sevedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;
