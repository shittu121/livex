"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function LoadingAnimation({ className = "" }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time - remove this in production
    // and replace with your actual loading logic
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <motion.div 
      className={`fixed inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm z-50 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative flex flex-col items-center">
        {/* Outer spinning circle */}
        <motion.div 
          className="w-24 h-24 rounded-full border-t-4 border-b-4 border-indigo-500"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "linear"
          }}
        />
        
        {/* Inner spinning circle (opposite direction) */}
        <motion.div 
          className="absolute w-16 h-16 rounded-full border-l-4 border-r-4 border-emerald-500"
          animate={{ rotate: -360 }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "linear"
          }}
        />
        
        {/* Center dot */}
        <motion.div 
          className="absolute w-6 h-6 bg-rose-500 rounded-full"
          animate={{ 
            scale: [1, 1.5, 1],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity 
          }}
        />
        
        {/* Loading text */}
        <motion.p 
          className="mt-8 text-white font-medium text-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading...
        </motion.p>
      </div>
    </motion.div>
  )
}