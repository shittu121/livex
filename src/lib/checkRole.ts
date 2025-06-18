import { redirect } from 'next/navigation'
import { createClient } from '@/lib/server'

export async function checkRole(allowedRoles: string[]) {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()

  // If no user is found, redirect to login
  if (!authData?.user) {
    redirect('/auth/login')
    return
  }

  // Fetch the user profile and check the role
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single()

  if (error || !profile) {
    redirect('/auth/login')
    return
  }

  if (!profile.role) {
    redirect('/profile-setup') 
    return
  }


  // Check if the profile role is in the allowed roles
  if (!allowedRoles.includes(profile.role)) {
    // Redirect based on the user's role
    switch (profile.role) {
      case 'admin':
        redirect('/dashboards/admin')
        break
      case 'brand':
        redirect('/dashboards/brand')
        break
      case 'influencer':
        const { data: onboardingData, error:onboardingerror } = await supabase
          .from('influencer_profiles')
          .select('has_onboarded')
          .eq('user_id', authData.user.id)
          .single()
        
        if (onboardingerror) {
          redirect('/onboarding/influencer')
        }
        
        if (onboardingData?.has_onboarded) {
          redirect('/dashboards/influencer')
        } else {
          redirect('/onboarding/influencer')
        }
        break
      default:
        redirect('/')
    }
    return
  }

  // Return profile if role is valid
  return profile
}
