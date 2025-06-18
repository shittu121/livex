import React, { useEffect, useState } from "react"
import { createClient } from "@/lib/client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { User, CheckCircle2, AlertCircle, Sparkles, Trophy, Target, Edit, Instagram, Youtube, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface FieldCheck {
  name: string
  completed: boolean
  category: string
}

export default function ProfileCompletion() {
  const [fieldChecks, setFieldChecks] = useState<FieldCheck[]>([])
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function loadProfileAndSocial() {
      const { data: userData, error: authError } = await supabase.auth.getUser()
      if (authError || !userData?.user) {
        setLoading(false)
        return
      }

      const userId = userData.user.id

      const { data: profile, error: profileError } = await supabase
        .from("influencer_profiles")
        .select("full_name, country, birthdate, avatar_url, terms_accepted, persona, niche_tags")
        .eq("user_id", userId)
        .single()

      const { data: socialData, error: socialError } = await supabase
        .from("social_accounts")
        .select("platform, connected")
        .eq("influencer_id", userId)

      if (profileError || socialError) {
        console.error("Failed to fetch data")
        setLoading(false)
        return
      }

      if (profile) {
        const fieldChecks: FieldCheck[] = [
          // Identity & Legal
          { name: "Full Name", completed: Boolean(profile.full_name), category: "Personal Information" },
          { name: "Country", completed: Boolean(profile.country), category: "Personal Information" },
          { name: "Birthdate", completed: Boolean(profile.birthdate), category: "Personal Information" },
          { name: "Avatar", completed: Boolean(profile.avatar_url), category: "Personal Information" },
          { name: "Terms Accepted", completed: profile.terms_accepted === true, category: "Personal Information" },

          // Persona & Interests
          { name: "Persona", completed: Boolean(profile.persona), category: "Persona & Interests" },
          { name: "Niche Tags", completed: Array.isArray(profile.niche_tags) && profile.niche_tags.length > 0, category: "Persona & Interests" }
        ]

        // Social Integration
        const expectedPlatforms = ['instagram', 'tiktok', 'youtube', 'facebook']

        const initialPlatformFields = expectedPlatforms.map(platform => ({
          name: capitalize(platform),
          completed: false,
          category: "Social Integration" as const
        }))
        
        if (Array.isArray(socialData)) {
          socialData.forEach(account => {
            const index = initialPlatformFields.findIndex(f => f.name.toLowerCase() === account.platform)
            if (index !== -1) {
              initialPlatformFields[index].completed = true
            }
          })
        }

        fieldChecks.push(...initialPlatformFields)

        const completedFields = fieldChecks.filter(f => f.completed).length
        const totalFields = fieldChecks.length
        const percentage = Math.round((completedFields / totalFields) * 100)

        setFieldChecks(fieldChecks)
        setCompletionPercentage(percentage)
      }

      setLoading(false)
    }

    loadProfileAndSocial()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const capitalize = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1)

  const getSocialIcon = (platform: string, isConnected: boolean) => {
    const iconClass = `h-6 w-6 ${isConnected ? '' : 'opacity-30 grayscale'}`
    
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className={`${iconClass} ${isConnected ? 'text-black dark:text-white' : 'text-gray-400'}`} />
      case 'tiktok':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
            <path 
              d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.71z" 
              className={isConnected ? 'text-black dark:text-white' : 'text-gray-400'}
            />
          </svg>
        )
      case 'youtube':
        return <Youtube className={`${iconClass} ${isConnected ? 'text-black dark:text-white' : 'text-gray-400'}`} />
      case 'facebook':
        return <Facebook className={`${iconClass} ${isConnected ? 'text-black dark:text-white' : 'text-gray-400'}`} />
      default:
        return <div className={`${iconClass} bg-gray-300 rounded`}></div>
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Group by category
  const categories = fieldChecks.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = []
    }
    acc[field.category].push(field)
    return acc
  }, {} as Record<string, FieldCheck[]>)

  const completedFields = fieldChecks.filter(f => f.completed).length
  const totalFields = fieldChecks.length

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Identity & Legal":
        return <User className="h-4 w-4" />
      case "Persona & Interests":
        return <Sparkles className="h-4 w-4" />
      case "Social Integration":
        return <Target className="h-4 w-4" />
      default:
        return <CheckCircle2 className="h-4 w-4" />
    }
  }

  const getProgressRing = (percentage: number) => {
    const radius = 45
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-200 dark:text-slate-700"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={percentage >= 80 ? "#10b981" : percentage >= 60 ? "#f59e0b" : "#ef4444"} />
              <stop offset="100%" stopColor={percentage >= 80 ? "#059669" : percentage >= 60 ? "#ea580c" : "#dc2626"} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {percentage}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Complete
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-xl overflow-hidden">
      <CardHeader className="pb-6 relative z-10">
        <div className="block lg:flex md:flex sm:flex items-center space-y-5 lg:space-y-0 md:space-y-0 justify-between">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white shadow-lg">
              <User className="h-5 w-5" />
            </div>
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
              Profile Completion
            </span>
            {completionPercentage === 100 && (
              <Trophy className="h-5 w-5 text-yellow-500 animate-bounce" />
            )}
          </CardTitle>
          <Link href="/dashboards/influencer/my-profile">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center mx-auto lg:mx-0 md:mx-0 sm:mx-0 gap-2 hover:bg-blue-50 dark:hover:bg-blue-950/50 border-blue-200 dark:border-blue-800"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 relative z-10">
        {/* Completion Ring */}
        <div className="text-center space-y-4">
          {getProgressRing(completionPercentage)}
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {completedFields} of {totalFields} fields completed
            </p>
            {completionPercentage === 100 ? (
              <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-semibold">Profile Complete!</span>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {totalFields - completedFields} field{totalFields - completedFields !== 1 ? 's' : ''} remaining
              </p>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        {Object.entries(categories).map(([category, fields]) => {
          const categoryCompleted = fields.filter(f => f.completed).length
          const categoryTotal = fields.length
          const categoryPercentage = Math.round((categoryCompleted / categoryTotal) * 100)
          const missingFields = fields.filter(f => !f.completed)

          return (
            <div key={category} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-slate-600 dark:text-slate-300">
                    {getCategoryIcon(category)}
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {category}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {categoryCompleted}/{categoryTotal}
                  </span>
                  {categoryPercentage === 100 ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  )}
                </div>
              </div>
              
              <Progress 
                value={categoryPercentage} 
                className="h-2 bg-slate-200 dark:bg-slate-700"
              />

              {/* Social Integration Icons */}
              {category === "Social Integration" && (
                <div className="flex gap-4 my-5">
                  {fields.map((field, index) => (
                    <div key={`${field.name}-icon-${index}`} className="flex flex-col border p-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 items-center gap-1">
                      {getSocialIcon(field.name, field.completed)}
                      <span className={`text-xs hidden ${field.completed ? 'text-slate-600 dark:text-slate-300' : 'text-gray-400'}`}>
                        {field.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {missingFields.length > 0 && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border border-red-200 dark:border-red-800/50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                        Missing fields:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {missingFields.map((field, index) => (
                          <span 
                            key={`${field.name}-${index}`}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                          >
                            {field.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Motivational Message */}
        {completionPercentage < 100 ? (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Boost Your Profile Power!
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Complete your profile to unlock premium campaigns and increase your visibility by up to 3x.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
                  Perfect Profile! 🎉
                </p>
                <p className="text-sm text-emerald-700 dark:text-emerald-200">
                  Your profile is complete and ready to attract the best campaigns.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}