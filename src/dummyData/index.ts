export const products = [
  { name: 'Rice', category: 'Basic Foods' },
  { name: 'Beans', category: 'Basic Foods' },
  { name: 'Pasta', category: 'Basic Foods' },
  { name: 'Salt', category: 'Oils and Spices' },
  { name: 'Pepper', category: 'Oils and Spices' },
  { name: 'Oil', category: 'Oils and Spices' },
  { name: 'Bread', category: 'Bakery' },
  { name: 'Sugar', category: 'Bakery' },
  { name: 'Butter', category: 'Bakery' },
  { name: 'Milk', category: 'Dairy' },
  { name: 'Cheese', category: 'Dairy' },
  { name: 'Yogurt', category: 'Dairy' },

];

export type Product = {
  name: string;
  category: string;
};

export const categories = [
  { id: 1, name: 'Basic Foods' },
  { id: 2, name: 'Oils and Spices' },
  { id: 3, name: 'Bakery' },
  { id: 4, name: 'Dairy' },
  { id: 5, name: 'Snacks' },
  { id: 6, name: 'Beverages' },
  { id: 7, name: 'Meats' },
  { id: 8, name: 'Fruits and Vegetables' },
  { id: 9, name: 'Hygiene' },
];