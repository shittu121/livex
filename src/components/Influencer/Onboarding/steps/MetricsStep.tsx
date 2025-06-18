"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, BarChart2, LineChart, Activity } from 'lucide-react'
import React, { useEffect, useState } from "react"
import { createClient } from "@/lib/client"
import Link from 'next/link'

interface MetricsStepProps {
  onPrevious: () => void
  onFinish: () => void
  isSubmitting: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  containerVariants: any
}

export function MetricsStep({ onPrevious, onFinish, isSubmitting, containerVariants }: MetricsStepProps) {
  const [hasOnboarded, setHasOnboarded] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const { data: userData, error: authError } = await supabase.auth.getUser()
      if (authError || !userData?.user) return

      const userId = userData.user.id

      const { data: profileData, error: fetchError } = await supabase
        .from("influencer_profiles")
        .select("has_onboarded")
        .eq("user_id", userId)
        .single()

      if (fetchError) {
        return
      }

      if (profileData) {
        setHasOnboarded(profileData.has_onboarded)
      }
    }

    loadProfile()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 500 
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.2 
      }
    }
  }

  const metricCards = [
    {
      title: "Audience Reach",
      description: "Track your combined reach across platforms",
      icon: Activity,
      color: "bg-blue-500",
      status: "Ready"
    },
    {
      title: "Engagement Analysis",
      description: "Measure how your audience interacts with content",
      icon: BarChart2,
      color: "bg-purple-500",
      status: "Ready"
    },
    {
      title: "Growth Tracking",
      description: "Monitor your follower growth over time",
      icon: LineChart,
      color: "bg-green-500",
      status: "Ready"
    }
  ]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="metrics-step"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="h-full flex flex-col"
      >
        <motion.h2 
          className="text-2xl font-bold mb-6 text-gray-900 dark:text-white"
          variants={contentVariants}
        >
          Your Analytics Dashboard
        </motion.h2>
        
        <motion.p
          className="text-gray-500 mb-8 dark:text-gray-400"
          variants={contentVariants}
        >
          Complete your profile to unlock these powerful metrics and insights
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={contentVariants}
        >
          {metricCards.map((card, index) => {
            const Icon = card.icon;
            
            return (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm dark:shadow-md p-6 hover:shadow-md dark:hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{card.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{card.description}</p>
                
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span>{card.status}</span>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
        
        <motion.div
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-6 mb-8"
          variants={contentVariants}
        >
          <div className="flex flex-wrap lg:flex-nowrap md:flex-row space-y-4 lg:space-y-0 md:space-y-0 items-start">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3 mr-4">
              <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">Almost there!</h3>
              <p className="text-blue-700 dark:text-blue-400 text-sm">
                You&apos;ve completed your profile setup. Launch your dashboard to access all your analytics and start managing your influencer presence.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="flex flex-wrap justify-between space-y-4 lg:space-y-0 md:space-y-0 items-center mt-auto"
          variants={contentVariants}
        >
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrevious}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Back
          </Button>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {!hasOnboarded ? (
            <Button 
              onClick={onFinish}
              disabled={isSubmitting}
              className="px-4 lg:px-8 md:px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg flex items-center space-x-2 text-base disabled:opacity-70"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          ): (
            <Link href="/dashboards/influencer/">
            <Button
            variant="outline"
            className="px-4 lg:px-8 md:px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:text-white hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg flex items-center space-x-2 text-base disabled:opacity-70"
          >
            <span className=''>Go to Dashboard</span>
          </Button>
          </Link>
        )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}