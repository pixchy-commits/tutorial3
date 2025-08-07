'use client';

import { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { exportToCSV, downloadCSV } from '@/utils/transactions';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';
import { Transaction } from '@/types';
import { format } from 'date-fns';

export default function Home() {
  const {
    transactions,
    categories,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAllData
  } = useTransactions();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions'>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleAddTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transactionData);
      setEditingTransaction(null);
    } else {
      addTransaction(transactionData);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleExport = () => {
    const csvContent = exportToCSV(transactions);
    const filename = `expense-tracker-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    downloadCSV(csvContent, filename);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            
            if (file.name.endsWith('.json')) {
              const importedData = JSON.parse(content);
              if (Array.isArray(importedData)) {
                // Import as array of transactions
                const validTransactions = importedData.filter(item => 
                  item.type && item.amount && item.description && item.category && item.date
                );
                alert(`Importing ${validTransactions.length} transactions`);
                // Note: You would need to implement importTransactions in the hook
                // importTransactions(validTransactions);
              }
            } else if (file.name.endsWith('.csv')) {
              // Basic CSV parsing (you might want to use a library like Papa Parse for production)
              const lines = content.split('\n');
              const headers = lines[0].split(',');
              const transactions = lines.slice(1).map(line => {
                const values = line.split(',');
                const obj: any = {};
                headers.forEach((header, index) => {
                  obj[header.trim()] = values[index]?.replace(/"/g, '').trim();
                });
                return obj;
              }).filter(t => t.Date && t.Amount && t.Description);
              
              alert(`Found ${transactions.length} transactions in CSV`);
              // Note: You would need to transform and import these
            }
          } catch (error) {
            alert('Error importing file. Please check the format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddTransaction={() => setIsFormOpen(true)}
        onImport={handleImport}
        onExport={handleExport}
        onClearData={clearAllData}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' ? (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
              <p className="text-gray-600">Track your expenses and revenue with detailed analytics</p>
            </div>
            <Dashboard transactions={transactions} categories={categories} />
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">All Transactions</h1>
              <p className="text-gray-600">Manage and review your financial transactions</p>
            </div>
            <TransactionList
              transactions={transactions}
              categories={categories}
              onEdit={handleEditTransaction}
              onDelete={deleteTransaction}
              onExport={handleExport}
            />
          </div>
        )}
      </main>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleAddTransaction}
        categories={categories}
        editingTransaction={editingTransaction}
      />
    </div>
  );
}
