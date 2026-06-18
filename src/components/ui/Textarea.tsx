import React from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-primary/80 mb-1.5">
            {label}
            {props.required && <span className="text-accent ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          rows={4}
          className={cn(
            'w-full px-4 py-3 rounded-xl border bg-white text-primary placeholder:text-gray-400 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent',
            'transition-all duration-200 text-sm font-body',
            error ? 'border-red-400 focus:ring-red-200' : 'border-gray-200',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
