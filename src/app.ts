import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { UserRoutes } from './app/modules/user/user.route';
import { CowRoutes } from './app/modules/cow/cow.route';
import httpStatus from 'http-status';
import { OrderRoutes } from './app/modules/order/order.route';
import { AdminRoutes } from './app/modules/admin/admin.route';
import { AuthRoutes } from './app/modules/auth/auth.route';
import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(cors());
app.use(cookieParser());

// perser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth/', UserRoutes);
app.use('/api/v1/users/', UserRoutes);
app.use('/api/v1/cows/', CowRoutes);
app.use('/api/v1/orders/', OrderRoutes);
app.use('/api/v1/admins/', AdminRoutes);
app.use('/api/v1/auth/', AuthRoutes);
// Handle Not Found Route
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

// global Error Handler
app.use(globalErrorHandler);

export default app;
