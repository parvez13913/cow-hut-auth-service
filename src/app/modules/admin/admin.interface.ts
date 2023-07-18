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

export type AdminModel = Model<IAdmin, Record<string, unknown>>;
