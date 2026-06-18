import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
  onClick?: () => void
}

const Card: React.FC<CardProps> = ({ children, className, hover = false, glass = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl p-6',
        glass
          ? 'glass-card'
          : 'bg-white border border-gray-100 shadow-card',
        hover && 'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

export default Card
