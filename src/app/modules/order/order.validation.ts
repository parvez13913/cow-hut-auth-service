import { z } from 'zod';

const createOrderZodSchema = z.object({
  body: z.object({
    cow: z.string({
      required_error: 'cow id is required',
    }),
    buyer: z.string({
      required_error: 'buyer id is required',
    }),
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
};
