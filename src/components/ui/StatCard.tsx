import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  color?: 'red' | 'blue' | 'green' | 'purple' | 'orange'
  trend?: { value: number; label: string }
  className?: string
}

const colorMap = {
  red: 'bg-red-50 text-accent',
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color = 'red', trend, className }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn('bg-white rounded-2xl p-6 shadow-card border border-gray-100', className)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-primary mt-1 tracking-tight">{value}</p>
          {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={cn('text-xs font-semibold', trend.value >= 0 ? 'text-green-600' : 'text-red-500')}>
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', colorMap[color])}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard
