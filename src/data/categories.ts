import { Category } from '@/types';

export const defaultExpenseCategories: Category[] = [
  {
    id: '1',
    name: 'Food & Dining',
    type: 'expense',
    color: '#ef4444',
    icon: '🍽️',
    subcategories: ['Restaurants', 'Groceries', 'Coffee', 'Fast Food', 'Alcohol']
  },
  {
    id: '2',
    name: 'Transportation',
    type: 'expense',
    color: '#3b82f6',
    icon: '🚗',
    subcategories: ['Gas', 'Public Transit', 'Parking', 'Maintenance', 'Insurance']
  },
  {
    id: '3',
    name: 'Shopping',
    type: 'expense',
    color: '#8b5cf6',
    icon: '🛍️',
    subcategories: ['Clothing', 'Electronics', 'Home & Garden', 'Books', 'Gifts']
  },
  {
    id: '4',
    name: 'Entertainment',
    type: 'expense',
    color: '#ec4899',
    icon: '🎬',
    subcategories: ['Movies', 'Games', 'Music', 'Sports', 'Hobbies']
  },
  {
    id: '5',
    name: 'Bills & Utilities',
    type: 'expense',
    color: '#f59e0b',
    icon: '⚡',
    subcategories: ['Electricity', 'Water', 'Internet', 'Phone', 'Insurance']
  },
  {
    id: '6',
    name: 'Healthcare',
    type: 'expense',
    color: '#10b981',
    icon: '🏥',
    subcategories: ['Doctor', 'Pharmacy', 'Insurance', 'Dental', 'Vision']
  },
  {
    id: '7',
    name: 'Education',
    type: 'expense',
    color: '#6366f1',
    icon: '📚',
    subcategories: ['Tuition', 'Books', 'Courses', 'Supplies', 'Training']
  },
  {
    id: '8',
    name: 'Travel',
    type: 'expense',
    color: '#14b8a6',
    icon: '✈️',
    subcategories: ['Flights', 'Hotels', 'Car Rental', 'Food', 'Activities']
  }
];

export const defaultRevenueCategories: Category[] = [
  {
    id: '9',
    name: 'Salary',
    type: 'revenue',
    color: '#22c55e',
    icon: '💼',
    subcategories: ['Base Salary', 'Bonus', 'Overtime', 'Commission']
  },
  {
    id: '10',
    name: 'Business',
    type: 'revenue',
    color: '#3b82f6',
    icon: '🏢',
    subcategories: ['Sales', 'Services', 'Consulting', 'Products']
  },
  {
    id: '11',
    name: 'Investments',
    type: 'revenue',
    color: '#8b5cf6',
    icon: '📈',
    subcategories: ['Dividends', 'Interest', 'Capital Gains', 'Crypto']
  },
  {
    id: '12',
    name: 'Freelance',
    type: 'revenue',
    color: '#f59e0b',
    icon: '💻',
    subcategories: ['Projects', 'Hourly Work', 'Contracts', 'Royalties']
  },
  {
    id: '13',
    name: 'Rental',
    type: 'revenue',
    color: '#06b6d4',
    icon: '🏠',
    subcategories: ['Property Rent', 'Equipment Rental', 'Vehicle Rental']
  },
  {
    id: '14',
    name: 'Other',
    type: 'revenue',
    color: '#84cc16',
    icon: '💰',
    subcategories: ['Gifts', 'Refunds', 'Cashback', 'Side Hustle']
  }
];

export const allDefaultCategories = [...defaultExpenseCategories, ...defaultRevenueCategories];
