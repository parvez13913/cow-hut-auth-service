import { IBreed, ICategory, ILabel, ILocation } from './cow.interface';

export const Location: ILocation[] = [
  'Dhaka',
  'Chattogram',
  'Barishal',
  'Rajshahi',
  'Sylhet',
  'Comilla',
  'Rangpur',
  'Mymensingh',
];

export const Breed: IBreed[] = [
  'Brahman',
  'Nellore',
  'Sahiwal',
  'Gir',
  'Indigenous',
  'Tharparkar',
  'Kankrej',
];

export const Label: ILabel[] = ['for sale', 'sold out'];

export const Category: ICategory[] = ['Dairy', 'Beef', 'Dual Purpose'];

export const cowSearchableFields = [
  'location',
  'category',
  'breed',
  'minPrice',
  'maxPrice',
];

export const cowFilterableFields = [
  'searchTerm',
  'minPrice',
  'maxPrice',
  'price',
  'location',
];
