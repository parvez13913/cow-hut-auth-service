import { z } from 'zod';

const loginZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'Phone Number is Required',
    }),
    password: z.string({
      required_error: 'password is Required',
    }),
  }),
});

export const AuthValidation = {
  loginZodSchema,
};
