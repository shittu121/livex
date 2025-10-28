"use client"

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/client'
import { ProgressTracker } from './ProgressTracker'
import { IdentityStep } from './steps/IdentityStep'
import PersonaStep from './steps/PersonaStep'
import SocialStep from './steps/SocialStep'
import { MetricsStep } from './steps/MetricsStep'
import LoadingAnimation from '@/components/loading-animation'

export type Step = {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export const steps: Step[] = [
  { 
    id: "identity",
    title: "Personal Information", 
    icon: "User", 
    description: "Tell us who you are" 
  },
  { 
    id: "persona",
    title: "Persona & Interests", 
    icon: "Globe", 
    description: "What makes you unique" 
  },
  { 
    id: "social",
    title: "Social Integration", 
    icon: "Camera", 
    description: "Connect your platforms" 
  },
  { 
    id: "metrics",
    title: "Metrics & Scoring", 
    icon: "ArrowRight", 
    description: "Complete your profile" 
  }
]

export default function InfluencerOnboardingForm() {
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [identityStepValid, setIdentityStepValid] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const goToNextStep = () => {
    // Only validate IdentityStep (step 0), other steps can be skipped
    if (step === 0 && !identityStepValid) {
      return // Don't proceed if IdentityStep is not valid
    }
    
    setStep((prev) => {
      if (prev >= 3) return 3
      return prev + 1
    })
  }

  const goToPrevStep = () => {
    if (step > 0) setStep((prev) => prev - 1)
  }

  const goToStep = (stepIndex: number) => {
    // Allow navigation to current step and previous steps
    // For next step, only validate if it's the IdentityStep
    if (stepIndex >= 0 && stepIndex < steps.length) {
      if (stepIndex === 1 && step === 0 && !identityStepValid) {
        return // Don't allow skipping to step 1 if IdentityStep is not valid
      }
      setStep(stepIndex)
    }
  }

  // Update IdentityStep validation
  const updateIdentityValidation = useCallback((isValid: boolean) => {
    setIdentityStepValid(isValid)
  }, [])

  useEffect(() => {
    async function CheckOnboardingStatus() {
      const { data: userData, error: authError } = await supabase.auth.getUser();
      if (authError || !userData?.user) {
        setFormError("You must be logged in to continue.");
        setLoading(true)
        return;
      }
  
      const userId = userData.user.id;
  
      const { data: profile, error: profileError } = await supabase
        .from('influencer_profiles')
        .select('has_onboarded')
        .eq('user_id', userId)
        .single();
  
      if (profileError) {
        console.error("Error fetching profile:", profileError.message);
        return;
      }
  
      if (profile.has_onboarded) {
        setStep(3)
        setLoading(false)
      }
    }
    CheckOnboardingStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
     window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const finishOnboarding = async () => {
    setIsSubmitting(true)
    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (authError || !userData?.user) {
      setFormError("You must be logged in.")
      setIsSubmitting(false)
      return
    }
  
    const userId = userData.user.id
  
    const { data: profileData, error: fetchError } = await supabase
      .from('influencer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
  
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error fetching profile:", fetchError.message)
      setFormError("Failed to load your profile.")
      setIsSubmitting(false)
      return
    }
  
    let onboardError

    // Simulate metrics-based RIVX calculation
    const randomScore = Math.random() * 100 // Score between 0 and 100
    
    let tierName = 'unqualified'
    if (randomScore >= 30 && randomScore < 50) {
      tierName = 'sliver'
    } else if (randomScore >= 50 && randomScore < 70) {
      tierName = 'diamond'
    } else if (randomScore >= 70) {
      tierName = 'gold'
    }
  
    if (profileData) {
      ({ error: onboardError } = await supabase
        .from('influencer_profiles')
        .update({ has_onboarded: true, rivx_score: randomScore.toFixed(2), tier_name: tierName })
        .eq('user_id', userId))
    }
  
    if (onboardError) {
      setFormError("Failed to complete onboarding. Please try again.")
      console.error("Onboarding error:", onboardError.message)
      setIsSubmitting(false)
      return
    }
  
    router.push('/dashboards/influencer')
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col">
      {loading ? <LoadingAnimation className={`${loading ? '' : 'hidden'}`} /> : ''}

      {/* Progress tracker */}
      <ProgressTracker 
        steps={steps} 
        currentStep={step} 
        onStepClick={goToStep}
        identityStepValid={identityStepValid}
      />

      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-md p-6 flex-grow"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 500 }}
      >
        <AnimatePresence mode="wait">
          {formError && (
            <motion.div 
              className="mb-6 p-4 text-sm bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-lg flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <span className="font-medium mr-2">Error:</span> {formError}
            </motion.div>
          )}

          {step === 0 && (
            <IdentityStep 
              onNext={goToNextStep} 
              onSkip={goToNextStep}
              containerVariants={containerVariants}
              setFormError={setFormError}
              updateValidation={updateIdentityValidation}
            />
          )}

          {step === 1 && (
            <PersonaStep 
              onPrevious={goToPrevStep} 
              onNext={goToNextStep}
              containerVariants={containerVariants}
            />
          )}

          {step === 2 && (
            <SocialStep
              onPrevious={goToPrevStep}
              onNext={goToNextStep}
              containerVariants={containerVariants}
              setFormError={setFormError}
            />
          )}

          {step === 3 && (
            <MetricsStep
              onPrevious={goToPrevStep}
              onFinish={finishOnboarding}
              containerVariants={containerVariants}
              isSubmitting={isSubmitting}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}