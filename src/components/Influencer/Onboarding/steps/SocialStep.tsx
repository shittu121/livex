"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Instagram, Youtube, Facebook, Check, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/client"
import { IoLogoTiktok } from "react-icons/io5";




interface SocialStepProps {
  onNext: () => void
  onPrevious: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  containerVariants: any
  setFormError: (error: string | null) => void
}

export default function SocialStep({ onNext, onPrevious, containerVariants, setFormError }: SocialStepProps) {
  const [connectedPlatforms, setConnectedPlatforms] = useState({
    instagram: false,
    tiktok: false,
    youtube: false,
    facebook: false
  })

  const [connecting, setConnecting] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
  const loadConnections = async () => {
    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (authError || !userData?.user) {
      setFormError("Authentication failed")
      // setLoading(false)
      return
    }

    const userId = userData.user.id

    const { data: socialAccounts, error: fetchError } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('influencer_id', userId)

    if (fetchError && fetchError.code !== 'PGRST116') {
      setFormError("Failed to load social account data.")
      // setLoading(false)
      return
    }

    if (socialAccounts && socialAccounts.length > 0) {
      const updatedState = { ...connectedPlatforms }

      socialAccounts.forEach((account) => {
        const platform = account.platform
        if (platform in updatedState) {
          updatedState[platform as keyof typeof updatedState] = account.connected
        }
      })

      setConnectedPlatforms(updatedState)
    }

    // setLoading(false)
  }

loadConnections()
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  const handleConnect = async (platform: keyof typeof connectedPlatforms) => {
    setConnecting(platform)

    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1500))

    const isConnected = !connectedPlatforms[platform]

    setConnectedPlatforms(prev => ({ ...prev, [platform]: isConnected }))
    setConnecting(null)

    // Get user ID
    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (authError || !userData?.user) {
      setFormError("Authentication failed")
      return
    }

    const userId = userData.user.id

    // Save or update connection status
    const { error: saveError } = await supabase.from('social_accounts').upsert({
      influencer_id: userId,
      platform,
      connected: isConnected,
      follower_count: isConnected ? Math.floor(Math.random() * 1000000) : null,
      platform_user_id: isConnected ? 'simulated_user_123' : null,
      last_sync: isConnected ? new Date().toISOString() : null
    }, {
      onConflict: 'influencer_id,platform'
    })

    if (saveError) {
      setFormError("Failed to connect platform.")
      return
    }
  }

  return (
    <motion.div
      key="step-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full flex flex-col justify-between"
    >
      <div>
        <motion.h2 
          className="text-2xl font-bold mb-6 text-gray-900 dark:text-white"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          Connect your platforms
        </motion.h2>

        <motion.p 
          className="text-gray-700 dark:text-gray-300 mb-8 max-w-xl mx-auto"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          Link your social accounts so we can personalize your dashboard.
        </motion.p>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.keys(connectedPlatforms).map((platform) => {
            const isConnecting = connecting === platform
            const isConnected = connectedPlatforms[platform as keyof typeof connectedPlatforms]

            let IconComponent = <Facebook className="h-6 w-6" />
            switch (platform) {
              case "instagram":
                IconComponent = <Instagram className="h-6 w-6 dark:text-blue-600" />
                break
              case "tiktok":
                IconComponent = <IoLogoTiktok className="h-6 w-6 dark:text-blue-600" />
                break
              case "youtube":
                IconComponent = <Youtube className="h-6 w-6 dark:text-blue-600" />
                break
              case "facebook":
                IconComponent = <Facebook className="h-6 w-6 dark:text-blue-600" />
                break
            }

            return (
              <motion.div
                key={platform}
                className={`p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                  isConnected ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:border dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  {isConnected ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    IconComponent
                  )}
                </div>

                <h3 className="font-medium capitalize mb-4 text-center">{platform}</h3>

                <Button
                  type="button"
                  onClick={() => handleConnect(platform as keyof typeof connectedPlatforms)}
                  disabled={isConnecting}
                  className={`w-full py-2 ${
                    isConnected
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  } rounded-full`}
                >
                  {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Connect'}
                </Button>
              </motion.div>
            )
          })}
        </div>

        <p className="text-xs text-gray-500 mb-6">* Simulated connection. These will integrate with real APIs in future.</p>
      </div>

      {/* Navigation Buttons */}
      <motion.div 
        className="w-full mx-auto pt-4 mt-auto flex space-y-4 lg:space-y-0 md:space-y-0 flex-wrap justify-center lg:justify-between md:justify-between sm:justify-between items-center"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
      >
        <div className="flex justify-between space-x-6 lg:space-x-4 md:space-x-4">
          <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious}
          className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Back
          </Button>
  
          <Button 
          type="button" 
          variant="ghost" 
          onClick={onNext}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Skip for now
          </Button>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="button"
            onClick={onNext}
            disabled={!Object.values(connectedPlatforms).some(Boolean)}
            className="px-8 py-6 justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg flex items-center space-x-2 text-base disabled:opacity-70"
          >
            <span>Continue</span>
            <ArrowRight className="h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}