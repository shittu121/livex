"use client"

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Step } from './onboardingForm'
import { iconMap } from '@/lib/iconMap'

interface ProgressTrackerProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (stepIndex: number) => void
  identityStepValid?: boolean
}

export function ProgressTracker({ 
  steps, 
  currentStep, 
  onStepClick,
  identityStepValid = false
}: ProgressTrackerProps) {
  const handleStepClick = (stepIndex: number) => {
    if (!onStepClick) return
    
    // Allow clicking on current step and previous steps
    // For next step, only validate if it's the IdentityStep
    const canClick = 
      stepIndex === currentStep || // Current step
      stepIndex < currentStep || // Previous steps
      (stepIndex === currentStep + 1 && (currentStep !== 0 || identityStepValid)) // Next step if current is valid (only validate IdentityStep)
    
    if (canClick) {
      onStepClick(stepIndex)
    }
  }

  const isStepClickable = (stepIndex: number) => {
    return (
      stepIndex === currentStep || 
      stepIndex < currentStep ||
      (stepIndex === currentStep + 1 && (currentStep !== 0 || identityStepValid))
    )
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative mb-4">
        {steps.map((s, i) => {
          const StepIcon = iconMap[s.icon]
          const isClickable = isStepClickable(i)
          
          return (
            <div key={i} className="flex flex-col items-center relative z-10">
              <motion.div 
                className={`w-12 h-12 rounded-full flex flex-wrap items-center justify-center text-white ${
                  i < currentStep 
                    ? "bg-green-500 dark:bg-green-600" 
                    : i === currentStep 
                      ? "bg-blue-500 dark:bg-blue-600" 
                      : "bg-gray-300 dark:bg-gray-600"
                } ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'}`}
                whileHover={isClickable ? { scale: 1.1 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleStepClick(i)}
                title={!isClickable && i === currentStep + 1 && currentStep === 0 ? "Complete the Identity step first" : ""}
              >
                {i < currentStep ? (
                  <Check className="w-5 h-5 lg:w-6 lg:h-6 md:w-6 md:h-6" />
                ) : (
                  <StepIcon className="w-5 h-5 lg:w-6 lg:h-6 md:w-6 md:h-6" />
                )}
              </motion.div>
              
              <motion.p 
                className={`text-xs lg:text-sm md:text-sm mt-3 lg:mt-2 md:mt-2 font-medium text-center ${
                  isClickable 
                    ? 'text-gray-800 dark:text-gray-200' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.2 }}
              >
                {s.title}
              </motion.p>
              <motion.p 
                className="text-[8px] lg:text-xs md:text-xs text-gray-500 mt-1 text-center dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.3 }}
              >
                {s.description}
              </motion.p>
            </div>
          )
        })}
        
        {/* Progress bar */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-600 z-0">
          <motion.div 
            className="h-full bg-blue-500"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  )
}