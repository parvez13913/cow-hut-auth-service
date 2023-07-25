import { SortOrder } from 'mongoose';
import { PaginationHelpers } from '../../../helpers/paginationHelpers';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { cowSearchableFields } from './cow.constants';
import { ICow, ICowFilter } from './cow.interface';
import { Cow } from './cow.model';
import { IGenericResponse } from '../../../interfaces/common';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { JwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';

const createCow = async (cowData: ICow): Promise<ICow> => {
  const result = (await Cow.create(cowData)).populate('seller');
  return result;
};

const getAllCows = async (
  filters: ICowFilter,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICow[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelpers.calculatePagination(paginationOptions);

  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: cowSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([fields, value]) => ({
        [fields]: value,
      })),
    });
  }

  const sortCondition: { [keys: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Cow.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const count = await Cow.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

const getSingleCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findById(id);
  return result;
};

const updateCow = async (
  id: string,
  payload: Partial<ICow>,
  token: string
): Promise<ICow | null> => {
  //checking wheater the updated data is emty object or not
  if (!Object.keys(payload).length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You did not enter anything to update !'
    );
  }
  //checking the cow is exist or not
  const isExist = await Cow.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow not found');
  }

  const isSEllerExist = await User.findOne({ _id: payload?.seller });

  if (payload?.seller) {
    if (!isSEllerExist) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'If you want to update, you have to pay the seller id'
      );
    }
  }

  const verifiedUser = JwtHelpers.verifiedToken(
    token,
    config.jwt.secret as Secret
  );

  if (!verifiedUser) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  const cow = await Cow.findById(id);

  if (cow?.seller.toString() !== verifiedUser?.userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden..');
  }

  const result = await Cow.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  }).populate('seller');

  return result;
};

const deleteCow = async (id: string, token: string): Promise<ICow | null> => {
  const isCowExist = await Cow.findById(id);
  if (!isCowExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow not found');
  }

  const verifiedUser = JwtHelpers.verifiedToken(
    token,
    config.jwt.secret as Secret
  );

  if (!verifiedUser) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  if (isCowExist?.seller.toString() !== verifiedUser?.userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden..');
  }

  const result = await Cow.findByIdAndDelete(id);

  return result;
};

export const CowService = {
  createCow,
  getAllCows,
  getSingleCow,
  updateCow,
  deleteCow,
};
