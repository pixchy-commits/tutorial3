'use client';

import { useState, useEffect } from 'react';
import { Transaction, Category } from '@/types';
import { allDefaultCategories } from '@/data/categories';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'expense-tracker-data';
const CATEGORIES_KEY = 'expense-tracker-categories';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(allDefaultCategories);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedTransactions = localStorage.getItem(STORAGE_KEY);
      const savedCategories = localStorage.getItem(CATEGORIES_KEY);
      
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
      
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions, loading]);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    }
  }, [categories, loading]);

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id
          ? { ...transaction, ...updates, updatedAt: new Date().toISOString() }
          : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: uuidv4()
    };

    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev =>
      prev.map(category =>
        category.id === id ? { ...category, ...updates } : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    // Don't allow deleting if there are transactions using this category
    const hasTransactions = transactions.some(t => t.category === categories.find(c => c.id === id)?.name);
    if (hasTransactions) {
      throw new Error('Cannot delete category that has transactions. Please reassign transactions first.');
    }
    
    setCategories(prev => prev.filter(category => category.id !== id));
  };

  const clearAllData = () => {
    setTransactions([]);
    setCategories(allDefaultCategories);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CATEGORIES_KEY);
  };

  const importTransactions = (importedTransactions: Transaction[]) => {
    const transactionsWithIds = importedTransactions.map(t => ({
      ...t,
      id: t.id || uuidv4(),
      createdAt: t.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    setTransactions(prev => [...transactionsWithIds, ...prev]);
  };

  return {
    transactions,
    categories,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    clearAllData,
    importTransactions
  };
};
