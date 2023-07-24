import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { JwtHelpers } from '../../helpers/jwtHelpers';
import config from '../../config';
import { Secret } from 'jsonwebtoken';

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }

      //verify token
      let verifiedUser = null;
      verifiedUser = JwtHelpers.verifiedToken(
        token,
        config.jwt.secret as Secret
      );
      req.user = verifiedUser;
      //   req.user = verifiedUser;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser?.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Fordidden');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
