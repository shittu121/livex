"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Instagram, Youtube, Facebook, Check, AlertTriangle, Wifi, WifiOff } from "lucide-react"
import { createClient } from "@/lib/client"
import { IoLogoTiktok } from "react-icons/io5"

interface SocialAccount {
  platform: string
  connected: boolean
  follower_count: number | null
  last_sync: string | null
  platform_user_id: string | null
}

interface SocialAccountHealthProps {
  setFormError?: (error: string | null) => void
}

export default function SocialAccountHealth({ setFormError }: SocialAccountHealthProps) {
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [reconnecting, setReconnecting] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadSocialAccounts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadSocialAccounts = async () => {
    try {
      const { data: userData, error: authError } = await supabase.auth.getUser()
      if (authError || !userData?.user) {
        setFormError?.("Authentication failed")
        setLoading(false)
        return
      }

      const { data: accounts, error: fetchError } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('influencer_id', userData.user.id)

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error("Failed to load social accounts:", fetchError.message)
        setFormError?.("Failed to load social account data")
        setLoading(false)
        return
      }

      setSocialAccounts(accounts || [])
    } catch (error) {
      console.error("Error loading social accounts:", error)
      setFormError?.("Failed to load social accounts")
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (platform: string) => {
    setReconnecting(platform)
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    try {
      const { data: userData, error: authError } = await supabase.auth.getUser()
      if (authError || !userData?.user) {
        setFormError?.("Authentication failed")
        return
      }

      const { error: saveError } = await supabase.from('social_accounts').upsert({
        influencer_id: userData.user.id,
        platform,
        connected: true,
        follower_count: Math.floor(Math.random() * 1000000),
        platform_user_id: `${platform}_user_${Date.now()}`,
        last_sync: new Date().toISOString()
      }, {
        onConflict: 'influencer_id,platform'
      })

      if (saveError) {
        console.error("Failed to connect platform:", saveError.message)
        setFormError?.("Failed to connect platform")
        return
      }

      await loadSocialAccounts()
    } catch (error) {
      console.error("Error connecting platform:", error)
      setFormError?.("Failed to connect platform")
    } finally {
      setReconnecting(null)
    }
  }

  const isTokenStale = (lastSync: string | null): boolean => {
    if (!lastSync) return false
    const syncDate = new Date(lastSync)
    const daysSinceSync = (Date.now() - syncDate.getTime()) / (1000 * 60 * 60 * 24)
    return daysSinceSync > 7 // Consider stale if not synced in 7 days
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-5 w-5" />
      case "tiktok":
        return <IoLogoTiktok className="h-5 w-5" />
      case "youtube":
        return <Youtube className="h-5 w-5" />
      case "facebook":
        return <Facebook className="h-5 w-5" />
      default:
        return <Wifi className="h-5 w-5" />
    }
  }

  const formatNumber = (num: number | null): string => {
    if (!num) return "0"
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatLastSync = (lastSync: string | null): string => {
    if (!lastSync) return "Never"
    const date = new Date(lastSync)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const platforms = ["instagram", "tiktok", "youtube", "facebook"]
  const connectedPlatforms = socialAccounts.filter(account => account.connected)
  const hasConnections = connectedPlatforms.length > 0

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Social Account Health
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {hasConnections 
                ? `${connectedPlatforms.length} platform${connectedPlatforms.length !== 1 ? 's' : ''} connected`
                : "No platforms connected"
              }
            </p>
          </div>
          {hasConnections && (
            <div className="flex items-center text-green-600">
              <Wifi className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Active</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {!hasConnections ? (
          <div className="text-center py-8">
            <WifiOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Social Accounts Connected
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Connect your social media accounts to track performance and analytics
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-3 max-w-md mx-auto">
              {platforms.map((platform) => (
                <Button
                  key={platform}
                  onClick={() => handleConnect(platform)}
                  disabled={reconnecting === platform}
                  className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {getPlatformIcon(platform)}
                  <span className="capitalize">
                    {reconnecting === platform ? "Connecting..." : `Connect ${platform}`}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {connectedPlatforms.map((account) => {
              const staleToken = isTokenStale(account.last_sync)
              
              return (
                <div
                  key={account.platform}
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    staleToken 
                      ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20' 
                      : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      staleToken 
                        ? 'bg-yellow-100 dark:bg-yellow-800' 
                        : 'bg-green-100 dark:bg-green-800'
                    }`}>
                      {getPlatformIcon(account.platform)}
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium capitalize text-gray-900 dark:text-white">
                          {account.platform}
                        </h4>
                        {staleToken ? (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <Check className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{formatNumber(account.follower_count)} followers</span>
                        <span>•</span>
                        <span>Last sync: {formatLastSync(account.last_sync)}</span>
                      </div>
                    </div>
                  </div>

                  {staleToken && (
                    <Button
                      onClick={() => handleConnect(account.platform)}
                      disabled={reconnecting === account.platform}
                      size="sm"
                      variant="outline"
                      className="border-yellow-300 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-600 dark:text-yellow-400"
                    >
                      {reconnecting === account.platform ? "Reconnecting..." : "Reconnect"}
                    </Button>
                  )}
                </div>
              )
            })}

            {/* Show unconnected platforms */}
            {platforms.filter(platform => !socialAccounts.some(acc => acc.platform === platform && acc.connected)).map((platform) => (
              <div
                key={platform}
                className="block lg:flex md:flex space-y-4 lg:space-y-0 md:space-y-0 items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                    {getPlatformIcon(platform)}
                  </div>
                  <div>
                    <h4 className="font-medium capitalize text-gray-900 dark:text-white">
                      {platform}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Not connected
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleConnect(platform)}
                  disabled={reconnecting === platform}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {reconnecting === platform ? "Connecting..." : "Connect Now"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}