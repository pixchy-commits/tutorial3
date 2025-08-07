import { Transaction, Filter, Analytics, ChartData, MonthlyData } from '@/types';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO, subMonths } from 'date-fns';

export const filterTransactions = (transactions: Transaction[], filter: Filter): Transaction[] => {
  return transactions.filter(transaction => {
    // Type filter
    if (filter.type && filter.type !== 'all' && transaction.type !== filter.type) {
      return false;
    }

    // Category filter
    if (filter.category && transaction.category_name !== filter.category) {
      return false;
    }

    // Date range filter
    if (filter.dateFrom || filter.dateTo) {
      const transactionDate = parseISO(transaction.date);
      const fromDate = filter.dateFrom ? parseISO(filter.dateFrom) : new Date(0);
      const toDate = filter.dateTo ? parseISO(filter.dateTo) : new Date();
      
      if (!isWithinInterval(transactionDate, { start: fromDate, end: toDate })) {
        return false;
      }
    }

    // Amount range filter
    if (filter.amountMin !== undefined && transaction.amount < filter.amountMin) {
      return false;
    }
    if (filter.amountMax !== undefined && transaction.amount > filter.amountMax) {
      return false;
    }

    // Search term filter
    if (filter.searchTerm) {
      const searchTerm = filter.searchTerm.toLowerCase();
      const searchableText = `${transaction.description} ${transaction.category_name} ${transaction.subcategory || ''} ${transaction.notes || ''}`.toLowerCase();
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }

    // Tags filter
    if (filter.tags && filter.tags.length > 0) {
      const transactionTags = transaction.tags || [];
      if (!filter.tags.some(tag => transactionTags.includes(tag))) {
        return false;
      }
    }

    return true;
  });
};

export const calculateAnalytics = (transactions: Transaction[]): Analytics => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const revenues = transactions.filter(t => t.type === 'revenue');

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalRevenue = revenues.reduce((sum, t) => sum + t.amount, 0);
  const profit = totalRevenue - totalExpenses;

  // Calculate monthly averages
  const monthsWithData = new Set(transactions.map(t => format(parseISO(t.date), 'yyyy-MM')));
  const monthCount = Math.max(monthsWithData.size, 1);
  
  const avgMonthlyExpenses = totalExpenses / monthCount;
  const avgMonthlyRevenue = totalRevenue / monthCount;

  // Top expense categories
  const expensesByCategory = expenses.reduce((acc, t) => {
    acc[t.category_name] = (acc[t.category_name] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const topExpenseCategories: ChartData[] = Object.entries(expensesByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Top revenue categories
  const revenuesByCategory = revenues.reduce((acc, t) => {
    acc[t.category_name] = (acc[t.category_name] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const topRevenueCategories: ChartData[] = Object.entries(revenuesByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Monthly trends (last 12 months)
  const monthlyTrends: MonthlyData[] = [];
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    const monthTransactions = transactions.filter(t => {
      const transactionDate = parseISO(t.date);
      return isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
    });

    const monthExpenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthRevenue = monthTransactions
      .filter(t => t.type === 'revenue')
      .reduce((sum, t) => sum + t.amount, 0);

    monthlyTrends.push({
      month: format(date, 'MMM yyyy'),
      expenses: monthExpenses,
      revenue: monthRevenue,
      profit: monthRevenue - monthExpenses
    });
  }

  return {
    totalExpenses,
    totalRevenue,
    profit,
    avgMonthlyExpenses,
    avgMonthlyRevenue,
    topExpenseCategories,
    topRevenueCategories,
    monthlyTrends
  };
};

export const exportToCSV = (transactions: Transaction[]): string => {
  const headers = [
    'Date',
    'Type',
    'Amount',
    'Description',
    'Category',
    'Subcategory',
    'Payment Method',
    'Tags',
    'Notes'
  ];

  const csvContent = [
    headers.join(','),
    ...transactions.map(t => [
      t.date,
      t.type,
      t.amount.toString(),
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.category_name.replace(/"/g, '""')}"`,
      `"${(t.subcategory || '').replace(/"/g, '""')}"`,
      `"${(t.payment_method || '').replace(/"/g, '""')}"`,
      `"${(t.tags || []).join(', ').replace(/"/g, '""')}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ].join(','))
  ].join('\n');

  return csvContent;
};

export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return format(parseISO(date), 'MMM dd, yyyy');
};

export const getUniqueValues = (transactions: Transaction[], field: keyof Transaction): string[] => {
  const values = transactions.map(t => t[field]).filter(Boolean) as string[];
  return Array.from(new Set(values)).sort();
};
