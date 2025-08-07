'use client';

import { useState } from 'react';
import { BarChart3, Plus, List, Settings, Download, Upload, Trash2, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationProps {
  activeTab: 'dashboard' | 'transactions';
  onTabChange: (tab: 'dashboard' | 'transactions') => void;
  onAddTransaction: () => void;
  onImport: () => void;
  onExport: () => void;
  onClearData: () => void;
}

export default function Navigation({
  activeTab,
  onTabChange,
  onAddTransaction,
  onImport,
  onExport,
  onClearData
}: NavigationProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">ติดตามรายจ่าย</h1>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                onClick={() => onTabChange('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <BarChart3 size={16} className="mr-2" />
                แดชบอร์ด
              </button>
              <button
                onClick={() => onTabChange('transactions')}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                  activeTab === 'transactions'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <List size={16} className="mr-2" />
                รายการธุรกรรม
              </button>
            </div>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onAddTransaction}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Plus size={16} className="mr-2" />
              เพิ่มรายการ
            </button>
            
            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-sm text-gray-600">
                <User size={16} className="mr-1" />
                {user?.email}
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-md"
                >
                  <Settings size={20} />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <button
                      onClick={() => {
                        onExport();
                        setShowMenu(false);
                      }}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                    >
                      <Download size={16} className="mr-2" />
                      ส่งออกข้อมูล
                    </button>
                    <button
                      onClick={() => {
                        onImport();
                        setShowMenu(false);
                      }}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                    >
                      <Upload size={16} className="mr-2" />
                      นำเข้าข้อมูล
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        if (window.confirm('คุณแน่ใจว่าต้องการล้างข้อมูลทั้งหมด? การกระทำนี้ไม่สามารถยกเลิกได้')) {
                          onClearData();
                        }
                        setShowMenu(false);
                      }}
                      className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left flex items-center"
                    >
                      <Trash2 size={16} className="mr-2" />
                      ล้างข้อมูลทั้งหมด
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        handleSignOut();
                        setShowMenu(false);
                      }}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-md"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMenu && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <button
                onClick={() => {
                  onTabChange('dashboard');
                  setShowMenu(false);
                }}
                className={`px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <BarChart3 size={16} className="mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => {
                  onTabChange('transactions');
                  setShowMenu(false);
                }}
                className={`px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center ${
                  activeTab === 'transactions'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <List size={16} className="mr-2" />
                Transactions
              </button>
              
              <hr className="my-2" />
              
              <button
                onClick={() => {
                  onAddTransaction();
                  setShowMenu(false);
                }}
                className="px-3 py-2 rounded-md text-base font-medium w-full text-left bg-blue-600 text-white flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Add Transaction
              </button>
              
              <button
                onClick={() => {
                  onExport();
                  setShowMenu(false);
                }}
                className="px-3 py-2 rounded-md text-base font-medium w-full text-left text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Download size={16} className="mr-2" />
                Export Data
              </button>
              
              <button
                onClick={() => {
                  onImport();
                  setShowMenu(false);
                }}
                className="px-3 py-2 rounded-md text-base font-medium w-full text-left text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Upload size={16} className="mr-2" />
                Import Data
              </button>
              
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
                    onClearData();
                  }
                  setShowMenu(false);
                }}
                className="px-3 py-2 rounded-md text-base font-medium w-full text-left text-red-600 hover:bg-red-50 flex items-center"
              >
                <Trash2 size={16} className="mr-2" />
                Clear All Data
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
