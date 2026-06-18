import React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface Step {
  id: number
  label: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between w-full overflow-x-auto pb-1">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep
        const isActive = step.id === currentStep
        const isLast = index === steps.length - 1

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={cn(
                  'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300',
                  isCompleted && 'bg-accent text-white shadow-glow-sm',
                  isActive && 'bg-primary text-white ring-4 ring-primary/20',
                  !isCompleted && !isActive && 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : step.id}
              </div>
              <div className="mt-1.5 text-center">
                <p
                  className={cn(
                    'text-xs font-semibold uppercase tracking-wide whitespace-nowrap',
                    isActive ? 'text-primary' : isCompleted ? 'text-accent' : 'text-gray-400'
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-muted hidden lg:block">{step.description}</p>
                )}
              </div>
            </div>
            {!isLast && (
              <div className="flex-1 mx-2 mb-6 min-w-[16px]">
                <div
                  className={cn(
                    'h-0.5 rounded-full transition-all duration-500',
                    isCompleted ? 'bg-accent' : 'bg-gray-200'
                  )}
                />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default Stepper
