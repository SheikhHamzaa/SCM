'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  TrendingUp,
  Users,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

export function WelcomeDashboard() {
  const stats = [
    {
      title: 'Total Products',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'text-[var(--qb-blue-primary)]',
      bgColor: 'bg-[var(--qb-blue-light)]'
    },
    {
      title: 'Active Orders',
      value: '89',
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-[var(--qb-green)]',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Suppliers',
      value: '156',
      change: '-2%',
      trend: 'down',
      icon: Users,
      color: 'text-[var(--qb-orange)]',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Pending Issues',
      value: '23',
      change: '+8%',
      trend: 'up',
      icon: AlertCircle,
      color: 'text-[var(--qb-red)]',
      bgColor: 'bg-red-50'
    }
  ];

  const quickActions = [
    { title: 'Add New Product', icon: Package, color: 'bg-[var(--qb-blue-light)]', textColor: 'text-[var(--qb-blue-primary)]' },
    { title: 'Generate Report', icon: BarChart3, color: 'bg-green-50', textColor: 'text-[var(--qb-green)]' },
    { title: 'View Analytics', icon: PieChart, color: 'bg-orange-50', textColor: 'text-[var(--qb-orange)]' },
    { title: 'System Health', icon: Activity, color: 'bg-purple-50', textColor: 'text-purple-600' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl p-6 lg:p-8 qb-shadow-lg border border-[var(--border)]"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-br from-[var(--qb-blue-primary)] to-[var(--qb-blue-dark)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <Package className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[var(--foreground)] mb-2">
            Welcome to PolyTex Supply Chain Management
          </h1>
          <p className="text-[var(--muted-foreground)] text-base lg:text-lg max-w-2xl mx-auto">
            Streamline your supply chain operations with our comprehensive management platform designed for efficiency and growth
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white rounded-xl p-6 qb-shadow hover:qb-shadow-xl qb-transition-fast border border-[var(--border)] group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--muted-foreground)] mb-2">
                  {stat.title}
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-[var(--foreground)] mb-3">
                  {stat.value}
                </p>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-[var(--qb-green)]' : 'text-[var(--qb-red)]'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                  <span className="text-[var(--muted-foreground)] font-normal">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 qb-transition-fast`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl p-6 lg:p-8 qb-shadow-lg border border-[var(--border)]"
      >
        <h2 className="text-xl lg:text-2xl font-bold text-[var(--foreground)] mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="
                flex flex-col items-center p-6 rounded-xl border-2 border-[var(--border)]
                hover:border-[var(--qb-blue-primary)] qb-transition-fast
                text-center group bg-[var(--card)] hover:qb-shadow-lg
                focus-ring
              "
            >
              <div className={`p-4 rounded-full ${action.color} mb-4 group-hover:scale-110 qb-transition-fast shadow-md`}>
                <action.icon className={`w-6 h-6 ${action.textColor}`} />
              </div>
              <span className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--qb-blue-primary)] qb-transition-fast">
                {action.title}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-xl p-6 qb-shadow-lg border border-[var(--border)]"
        >
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[var(--qb-blue-primary)]" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              { title: 'New product "Cotton Fabric" added', time: '2 hours ago', type: 'success' },
              { title: 'Shipment #1234 departed from port', time: '4 hours ago', type: 'info' },
              { title: 'Low stock alert for Item #567', time: '6 hours ago', type: 'warning' },
              { title: 'Monthly report generated', time: '1 day ago', type: 'info' },
            ].map((activity, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-[var(--muted)] qb-transition-fast border border-transparent hover:border-[var(--border)]"
              >
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === 'success' ? 'bg-[var(--qb-green)]' :
                  activity.type === 'warning' ? 'bg-[var(--qb-orange)]' :
                  'bg-[var(--qb-blue-primary)]'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--foreground)] mb-1">{activity.title}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white rounded-xl p-6 qb-shadow-lg border border-[var(--border)]"
        >
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[var(--qb-green)]" />
            System Status
          </h2>
          <div className="space-y-4">
            {[
              { service: 'Database Connection', status: 'Operational', percentage: 99.9 },
              { service: 'API Services', status: 'Operational', percentage: 99.5 },
              { service: 'File Storage', status: 'Operational', percentage: 98.8 },
              { service: 'Email Notifications', status: 'Operational', percentage: 99.2 }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--muted)] border border-[var(--border)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[var(--qb-green)] rounded-full"></div>
                  <span className="text-sm font-medium text-[var(--foreground)]">{item.service}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-[var(--qb-green)]">{item.status}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">{item.percentage}%</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
