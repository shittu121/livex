import InfluencerOnboardingForm from '@/components/Influencer/Onboarding/onboardingForm'
import React from 'react'
import { checkRole } from '@/lib/checkRole'


export default async function InfluencerOnboarding () {
  await checkRole(['influencer'])
  return (
    <div className='min-h-screen dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 bg-gradient-to-br from-white to-slate-100'>
      <InfluencerOnboardingForm />
    </div>
  )
}

