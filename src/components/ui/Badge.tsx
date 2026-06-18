import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'active' | 'pending' | 'expired' | 'basic' | 'regular' | 'premium' | 'default'
  children: React.ReactNode
  className?: string
}

const variantStyles = {
  active: 'bg-green-100 text-green-700 border border-green-200',
  pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  expired: 'bg-gray-100 text-gray-600 border border-gray-200',
  basic: 'bg-gray-100 text-gray-700 border border-gray-200',
  regular: 'bg-red-50 text-accent border border-red-200',
  premium: 'bg-blue-50 text-blue-700 border border-blue-200',
  default: 'bg-gray-100 text-gray-700 border border-gray-200',
}

const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

export default Badge
