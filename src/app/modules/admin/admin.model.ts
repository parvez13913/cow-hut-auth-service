/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { AdminModel, IAdmin } from './admin.interface';
import { Role } from './admin.constants';
import bcrypt from 'bcrypt';
import config from '../../../config';

const adminSchema = new Schema<IAdmin, AdminModel>(
  {
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      enum: Role,
    },
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

adminSchema.statics.isAdminExist = async function (
  phoneNumber: string
): Promise<
  (Pick<IAdmin, 'password' | 'role' | 'phoneNumber'> & { _id: string }) | null
> {
  return await Admin.findOne(
    { phoneNumber },
    { _id: 1, phoneNumber: 1, role: 1, password: 1 }
  );
};

adminSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  sevedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, sevedPassword);
};

adminSchema.pre('save', async function (next) {
  const admin = this;
  admin.password = await bcrypt.hash(
    admin.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

export const Admin = model<IAdmin, AdminModel>('Admin', adminSchema);
