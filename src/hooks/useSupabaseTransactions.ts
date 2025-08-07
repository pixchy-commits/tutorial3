'use client';

import { useState, useEffect } from 'react';
import { Transaction, Category } from '@/types';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const useSupabaseTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Load data when user is available
  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setTransactions([]);
      setCategories([]);
      setLoading(false);
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Load transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (transactionsError) throw transactionsError;

      setCategories(categoriesData || []);
      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          ...transactionData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === id ? data : transaction
        )
      );
      return data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  const addCategory = async (categoryData: Omit<Category, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          ...categoryData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setCategories(prev =>
        prev.map(category =>
          category.id === id ? data : category
        )
      );
      return data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    // Check if there are transactions using this category
    const hasTransactions = transactions.some(t => t.category_id === id);
    if (hasTransactions) {
      throw new Error('Cannot delete category that has transactions. Please reassign transactions first.');
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setCategories(prev => prev.filter(category => category.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  const clearAllData = async () => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Delete all transactions first
      const { error: transactionsError } = await supabase
        .from('transactions')
        .delete()
        .eq('user_id', user.id);

      if (transactionsError) throw transactionsError;

      // Delete all custom categories (keep default ones)
      const { error: categoriesError } = await supabase
        .from('categories')
        .delete()
        .eq('user_id', user.id);

      if (categoriesError) throw categoriesError;

      // Recreate default categories
      await supabase.rpc('create_default_categories_for_user', {
        user_uuid: user.id
      });

      // Reload data
      await loadData();
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  };

  const importTransactions = async (importedTransactions: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const transactionsWithUserId = importedTransactions.map(t => ({
        ...t,
        user_id: user.id
      }));

      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionsWithUserId)
        .select();

      if (error) throw error;

      // Reload transactions
      await loadData();
      return data;
    } catch (error) {
      console.error('Error importing transactions:', error);
      throw error;
    }
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
    importTransactions,
    refreshData: loadData
  };
};
