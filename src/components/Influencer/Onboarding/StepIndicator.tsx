"use client"

import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

// Define the type for a step
interface Step {
  index: number
  title: string
  description: string
  icon: LucideIcon
}

interface StepIndicatorProps {
  step: Step
  steps: Step[]
  currentStep: number
  onStepClick?: (stepIndex: number) => void
}

export default function StepIndicator({ step, currentStep, onStepClick }: StepIndicatorProps) {
  const Icon = step.icon

  const handleClick = () => {
    if (onStepClick) {
      onStepClick(step.index)
    }
  }

  return (
    <div className="flex flex-col items-center relative z-10">
      <motion.div 
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
          step.index < currentStep 
            ? "bg-green-500 dark:bg-green-600" 
            : step.index === currentStep 
              ? "bg-blue-500 dark:bg-blue-600" 
              : "bg-gray-300 dark:bg-gray-600"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: step.index * 0.1 }}
        onClick={handleClick}
      >
        {step.index < currentStep ? (
          <Check className="w-6 h-6" />
        ) : (
          <Icon className="w-6 h-6" />
        )}
      </motion.div>
      <motion.p 
        className="text-sm mt-2 font-medium text-center text-gray-800 dark:text-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: step.index * 0.1 + 0.2 }}
      >
        {step.title}
      </motion.p>
      <motion.p 
        className="text-xs text-gray-500 mt-1 text-center dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: step.index * 0.1 + 0.3 }}
      >
        {step.description}
      </motion.p>
    </div>
  )
}