/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Settings, Share2, Save, AlertCircle, Users, Activity, Building2, LucideIcon } from 'lucide-react'
// import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from '@/lib/client'
import { IdentitySection } from './IdentitySection'
import PersonaSection from './PersonaSection'
import LoadingAnimation from '@/components/loading-animation'
import { toast } from 'react-toastify'
import { SidebarNav } from '@/components/SidebarNav'
import NeedHelp from '@/components/need-help'
// import { SocialSection } from './components/SocialSection'

type ProfileSection = 'identity' | 'persona' | 'social'

interface ProfileData {
  identity: {
    fullName: string
    country: string
    birthdate: string
    avatar_url: string
    terms_accepted: boolean
  } | null
  persona: {
    persona: string
    niche_tags: string[]
    vibe_style: string
    ai_summary: string
  } | null
  social: {
    instagram: string
    twitter: string
    tiktok: string
    youtube: string
  } | null
}

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<ProfileSection>('identity')
  const [profileData, setProfileData] = useState<ProfileData>({
    identity: null,
    persona: null,
    social: null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchProfileData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      const { data: userData, error: authError } = await supabase.auth.getUser()
      
      if (authError || !userData?.user) {
        setError("You must be logged in to view your profile.")
        return
      }

      const userId = userData.user.id

      // Fetch profile data
      const { data: profile, error: profileError } = await supabase
        .from('influencer_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError)
        setError("Failed to load profile data.")
        return
      }

      if (profile) {
        setProfileData({
          identity: {
            fullName: profile.full_name || '',
            country: profile.country || '',
            birthdate: profile.birthdate || '',
            avatar_url: profile.avatar_url || '',
            terms_accepted: profile.terms_accepted || false
          },
          persona: {
            persona: profile.persona || '',
            niche_tags: profile.niche_tags || [],
            vibe_style: profile.vibe_style || '',
            ai_summary: profile.ai_summary || ''
          },
          social: {
            instagram: profile.instagram_url || '',
            twitter: profile.twitter_url || '',
            tiktok: profile.tiktok_url || '',
            youtube: profile.youtube_url || ''
          }
        })
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const handleSectionChange = (section: ProfileSection) => {
    // if (hasUnsavedChanges) {
    //   const confirmLeave = window.confirm(
    //     "You have unsaved changes. Are you sure you want to leave this section?"
    //   )
    //   if (!confirmLeave) return
    // }
    setActiveSection(section)
    setHasUnsavedChanges(false)
    setError(null)
    setSuccess(null)
  }

  const handleDataChange = useCallback((section: ProfileSection, data: any) => {
    setProfileData(prev => ({
      ...prev,
      [section]: data
    }))
    setHasUnsavedChanges(true)
    setError(null)
    setSuccess(null)
  }, [])

  const handleSave = useCallback(async (section: ProfileSection, data: any) => {
    try {
      setError(null)
      setSuccess(null)
      
      const { data: userData, error: authError } = await supabase.auth.getUser()
      
      if (authError || !userData?.user) {
        setError("You must be logged in to save changes.")
        return false
      }

      const userId = userData.user.id
      let updateData: any = { user_id: userId }

      // Map section data to database columns
      switch (section) {
        case 'identity':
          updateData = {
            ...updateData,
            full_name: data.fullName,
            country: data.country,
            birthdate: data.birthdate,
            avatar_url: data.avatar_url,
            terms_accepted: data.terms_accepted,
            accepted_at: data.terms_accepted ? new Date().toISOString() : null
          }
          break
        case 'persona':
           updateData = {
             ...updateData,
             persona: data.persona,
             niche_tags: data.niche_tags,
             vibe_style: data.vibe_style,
             ai_summary: data.ai_summary
           }
           break
        case 'social':
          updateData = {
            ...updateData,
            instagram_url: data.instagram,
            twitter_url: data.twitter,
            tiktok_url: data.tiktok,
            youtube_url: data.youtube
          }
          break
      }

      const { error: saveError } = await supabase
        .from('influencer_profiles')
        .upsert(updateData, {
          onConflict: 'user_id'
        })

      if (saveError) {
        console.error('Save error:', saveError)
        setError("Failed to save changes. Please try again.")
        toast.error("Failed to save changes. Please try again.")
        return false
      }

      setSuccess("Changes saved successfully!")
      toast.success("Changes saved successfully!")
      setHasUnsavedChanges(false)
      
      // Update local state
      setProfileData(prev => ({
        ...prev,
        [section]: data
      }))

      return true
    } catch (err) {
      console.error('Error saving profile:', err)
      setError("An unexpected error occurred while saving.")
      return false
    }
  }, [supabase])

  const sectionTabs = [
    { id: 'identity', label: 'Identity', icon: User },
    { id: 'persona', label: 'Persona', icon: Settings },
    { id: 'social', label: 'Social', icon: Share2 }
  ]

  interface NavItem {
    name: string
    icon: LucideIcon
    path: string
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0 }
  }
  

  if (loading) {
    return (
      <LoadingAnimation className={`${loading ? '' : 'hidden'}`} />
    )
  }

  const navItems: NavItem[] = [
  { name: 'Dashboard', icon: Users, path: '/dashboards/influencer' },
  { name: 'Community', icon: Building2, path: '/community' },
  { name: 'Marketplace', icon: Activity, path: '/marketplace' },
  { name: 'Settings', icon: Settings, path: '/dashboards/influencer/settings' },
]

  return (
    
    <div className="dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 bg-gradient-to-br from-white to-slate-100 dark:text-white text-slate-600">
          {/* Main Content */}
          <div className="flex">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r min-h-screen border-slate-200 dark:border-slate-700 p-4"> 
              <SidebarNav items={navItems} />
              <NeedHelp />
            </aside>
            <div className="mx-auto w-full lg:w-[70rem] md:w-[70rem] px-8 py-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Profile Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your profile information and settings
                </p>
              </motion.div>
      
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <AlertDescription className="text-red-800 dark:text-red-300">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
      
              {success && (
                <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 hidden dark:bg-green-900/20">
                  <Save className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-300">
                    {success}
                  </AlertDescription>
                </Alert>
              )}
      
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                {/* Section Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex space-x-8 px-6" aria-label="Profile sections">
                    {sectionTabs.map((tab) => {
                      const Icon = tab.icon
                      const isActive = activeSection === tab.id
                      return (
                        <button
                          key={tab.id}
                          onClick={() => handleSectionChange(tab.id as ProfileSection)}
                          className={`
                            flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-xs lg:text-sm md:text-sm transition-colors
                            ${isActive
                              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                            }
                          `}
                        >
                          <Icon className="h-5 w-5 sm-hidden" />
                          <span>{tab.label}</span>
                          {hasUnsavedChanges && activeSection === tab.id && (
                            <div className="w-2 h-2 bg-orange-500 rounded-full hidden"></div>
                          )}
                        </button>
                      )
                    })}
                  </nav>
                </div>
      
                {/* Section Content */}
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {activeSection === 'identity' && (
                      <IdentitySection
                        key="identity"
                        initialData={profileData.identity}
                        onDataChange={(data) => handleDataChange('identity', data)}
                        onSave={(data) => handleSave('identity', data)}
                        containerVariants={containerVariants}
                        setFormError={setError}
                      />
                    )}
                    
                    {activeSection === 'persona' && (
                      <PersonaSection
                        key="persona"
                        // initialData={profileData.persona}
                        onDataChange={(data) => handleDataChange('persona', data)}
                        onSave={(data) => handleSave('persona', data)}
                        containerVariants={containerVariants}
                        setFormError={setError}
                      />
                    )}
                    
                    {activeSection === 'social' && (
                      <motion.div
                        key="social"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="text-center py-12"
                      >
                        <Share2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Social Section
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          This section will contain social media links and settings.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
      </div>
    </div>
  )
}