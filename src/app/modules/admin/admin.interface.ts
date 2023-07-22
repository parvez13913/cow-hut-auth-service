/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type AdminName = {
  firstName: string;
  lastName: string;
};

export type IAdmin = {
  password: string;
  role: 'admin';
  name: AdminName;
  phoneNumber: string;
  address: string;
};

export type ILoginAdminResponse = {
  accessToken: string;
  refreshToken?: string;
};
export type ILoginAdmin = {
  phoneNumber: string;
  password: string;
};

export type AdminModel = {
  isAdminExist(
    phoneNumber: string
  ): Promise<
    (Pick<IAdmin, 'password' | 'role' | 'phoneNumber'> & { _id: string }) | null
  >;
  isPasswordMatched(
    givenPassword: string,
    sevedPassword: string
  ): Promise<boolean>;
} & Model<IAdmin>;
