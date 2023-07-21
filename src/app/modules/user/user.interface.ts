/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type UserName = {
  firstName: string;
  lastName: string;
};

export type IUser = {
  id?: string;
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
  ): Promise<Pick<IUser, 'password' | 'role' | 'phoneNumber' | 'id'> | null>;
  isPasswordMatched(
    givenPassword: string,
    sevedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;
