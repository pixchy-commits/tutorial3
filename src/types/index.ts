export interface Transaction {
  id: string;
  user_id: string;
  type: 'expense' | 'revenue';
  amount: number;
  description: string;
  category_id?: string;
  category_name: string;
  subcategory?: string;
  date: string;
  tags?: string[];
  payment_method?: string;
  recurring?: boolean;
  recurring_frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'expense' | 'revenue';
  color: string;
  icon: string;
  subcategories?: string[];
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id?: string;
  category_name: string;
  amount: number;
  period: 'monthly' | 'yearly';
  alert_threshold?: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  currency?: string;
  timezone?: string;
  preferences?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface Filter {
  type?: 'expense' | 'revenue' | 'all';
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  searchTerm?: string;
  tags?: string[];
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface MonthlyData {
  month: string;
  expenses: number;
  revenue: number;
  profit: number;
}

export interface Analytics {
  totalExpenses: number;
  totalRevenue: number;
  profit: number;
  avgMonthlyExpenses: number;
  avgMonthlyRevenue: number;
  topExpenseCategories: ChartData[];
  topRevenueCategories: ChartData[];
  monthlyTrends: MonthlyData[];
}
