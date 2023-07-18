import { z } from 'zod';
import { Breed, Category, Label, Location } from './cow.constants';

const createCowZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    age: z.number({
      required_error: 'Age is required',
    }),
    price: z.number({
      required_error: 'Price is required',
    }),
    location: z.enum([...Location] as [string, ...string[]], {
      required_error: 'Location is required',
    }),
    breed: z.enum([...Breed] as [string, ...string[]], {
      required_error: 'Breed is required',
    }),
    weight: z.number({
      required_error: 'Weight is required',
    }),
    label: z.enum([...Label] as [string, ...string[]], {
      required_error: 'Label is required',
    }),
    category: z.enum([...Category] as [string, ...string[]], {
      required_error: 'Category is required',
    }),
    seller: z.string({
      required_error: 'Seller is required',
    }),
  }),
});

const updatedCowZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .optional(),
    age: z
      .number({
        required_error: 'Age is required',
      })
      .optional(),
    price: z
      .number({
        required_error: 'Price is required',
      })
      .optional(),
    location: z
      .enum([...Location] as [string, ...string[]], {
        required_error: 'Location is required',
      })
      .optional(),
    breed: z
      .enum([...Breed] as [string, ...string[]], {
        required_error: 'Breed is required',
      })
      .optional(),
    weight: z
      .number({
        required_error: 'Weight is required',
      })
      .optional(),
    label: z
      .enum([...Label] as [string, ...string[]], {
        required_error: 'Label is required',
      })
      .optional(),
    category: z
      .enum([...Category] as [string, ...string[]], {
        required_error: 'Category is required',
      })
      .optional(),
    seller: z
      .string({
        required_error: 'Seller is required',
      })
      .optional(),
  }),
});

export const CowValidation = {
  createCowZodSchema,
  updatedCowZodSchema,
};
