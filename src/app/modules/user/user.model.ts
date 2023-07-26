/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import { UserRole } from './user.constants';
import bcrypt from 'bcrypt';
import config from '../../../config';

const userSchema = new Schema<IUser, UserModel>(
  {
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      enum: UserRole,
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
    budget: {
      type: Number,
      required: true,
    },
    income: {
      type: Number,
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

userSchema.statics.isUserExist = async function (
  phoneNumber: string
): Promise<
  (Pick<IUser, 'password' | 'role' | 'phoneNumber'> & { _id: string }) | null
> {
  return await User.findOne({ phoneNumber }, { _id: 1, role: 1, password: 1 });
};

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  sevedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, sevedPassword);
};

userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

export const User = model<IUser, UserModel>('User', userSchema);
