'use client';

import { Transaction, Category } from '@/types';
import { calculateAnalytics, formatCurrency } from '@/utils/transactions';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, BarChart3 } from 'lucide-react';
import { useMemo } from 'react';

interface DashboardProps {
  transactions: Transaction[];
  categories: Category[];
}

export default function Dashboard({ transactions, categories }: DashboardProps) {
  // Thai translations for category names
  const categoryNameMapTH: Record<string, string> = {
    'Food & Dining': 'อาหารและการรับประทาน',
    'Transportation': 'การเดินทาง',
    'Shopping': 'ช้อปปิ้ง',
    'Entertainment': 'บันเทิง',
    'Bills & Utilities': 'บิลและค่าสาธารณูปโภค',
    'Healthcare': 'สุขภาพ',
    'Education': 'การศึกษา',
    'Travel': 'ท่องเที่ยว',
    'Salary': 'เงินเดือน',
    'Business': 'ธุรกิจ',
    'Investments': 'การลงทุน',
    'Freelance': 'ฟรีแลนซ์',
    'Rental': 'ค่าเช่า',
    'Other': 'อื่นๆ',
  };
  const analytics = useMemo(() => calculateAnalytics(transactions), [transactions]);

  const COLORS = ['#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#14b8a6'];

  // Prepare data for expense pie chart
  const expensePieData = analytics.topExpenseCategories.map((item, index) => ({
    ...item,
    color: categories.find(cat => cat.name === item.name)?.color || COLORS[index % COLORS.length]
  }));

  // Prepare data for revenue pie chart
  const revenuePieData = analytics.topRevenueCategories.map((item, index) => ({
    ...item,
    color: categories.find(cat => cat.name === item.name)?.color || COLORS[index % COLORS.length]
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    color = 'blue' 
  }: { 
    title: string; 
    value: string; 
    icon: any; 
    trend?: { direction: 'up' | 'down'; percentage: number }; 
    color?: string;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${
            color === 'red' ? 'text-red-600' : 
            color === 'green' ? 'text-green-600' : 
            'text-blue-600'
          }`}>
            {value}
          </p>
          {trend && (
            <p className={`text-sm flex items-center ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.direction === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="ml-1">{trend.percentage}% จากเดือนที่แล้ว</span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${
          color === 'red' ? 'bg-red-100' : 
          color === 'green' ? 'bg-green-100' : 
          'bg-blue-100'
        }`}>
          <Icon size={24} className={
            color === 'red' ? 'text-red-600' : 
            color === 'green' ? 'text-green-600' : 
            'text-blue-600'
          } />
        </div>
      </div>
    </div>
  );

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 size={64} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">แดชบอร์ดการเงิน</h1>
        <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีข้อมูล</h3>
        <p className="text-gray-500">เพิ่มธุรกรรมเพื่อดูสรุปและวิเคราะห์ข้อมูลของคุณ</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Title and Subtitle */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">แดชบอร์ดการเงิน</h1>
        <p className="text-gray-600 mb-6">สรุปและวิเคราะห์รายรับรายจ่ายของคุณ</p>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="รายรับทั้งหมด"
          value={formatCurrency(analytics.totalRevenue)}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="รายจ่ายทั้งหมด"
          value={formatCurrency(analytics.totalExpenses)}
          icon={TrendingDown}
          color="red"
        />
        <StatCard
          title="กำไรสุทธิ"
          value={formatCurrency(analytics.profit)}
          icon={DollarSign}
          color={analytics.profit >= 0 ? 'green' : 'red'}
        />
        <StatCard
          title="รายรับเฉลี่ยต่อเดือน"
          value={formatCurrency(analytics.avgMonthlyRevenue)}
          icon={Target}
          color="blue"
        />
      </div>

      {/* Charts Row 1 - Monthly Trends */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="mr-2" size={20} />
          แนวโน้มรายเดือน
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} name="รายรับ" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="รายจ่าย" />
              <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} name="กำไร" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 - Category Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories */}
        {analytics.topExpenseCategories.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 text-red-600">รายจ่ายตามหมวดหมู่</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensePieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expensePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Revenue Categories */}
        {analytics.topRevenueCategories.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 text-green-600">รายรับตามหมวดหมู่</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenuePieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenuePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Charts Row 3 - Category Comparison */}
      {(analytics.topExpenseCategories.length > 0 || analytics.topRevenueCategories.length > 0) && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">เปรียบเทียบหมวดหมู่</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  ...analytics.topExpenseCategories.map(item => ({ ...item, type: 'รายจ่าย' })),
                  ...analytics.topRevenueCategories.map(item => ({ ...item, type: 'รายรับ' }))
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Categories Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Expense Categories */}
        {analytics.topExpenseCategories.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 text-red-600">หมวดหมู่รายจ่ายอันดับต้น</h3>
            <div className="space-y-3">
              {analytics.topExpenseCategories.slice(0, 5).map((category, index) => {
                const categoryInfo = categories.find(cat => cat.name === category.name);
                const percentage = (category.value / analytics.totalExpenses) * 100;
                // Translate category name if possible
                const categoryNameTH = categoryNameMapTH[category.name] || category.name;
                return (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{categoryInfo?.icon || '📝'}</span>
                      <span className="font-medium">{categoryNameTH}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-red-600">
                        {formatCurrency(category.value)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Top Revenue Categories */}
        {analytics.topRevenueCategories.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 text-green-600">หมวดหมู่รายรับอันดับต้น</h3>
            <div className="space-y-3">
              {analytics.topRevenueCategories.slice(0, 5).map((category, index) => {
                const categoryInfo = categories.find(cat => cat.name === category.name);
                const percentage = (category.value / analytics.totalRevenue) * 100;
                // Translate category name if possible
                const categoryNameTH = categoryNameMapTH[category.name] || category.name;
                return (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{categoryInfo?.icon || '📝'}</span>
                      <span className="font-medium">{categoryNameTH}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        {formatCurrency(category.value)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
