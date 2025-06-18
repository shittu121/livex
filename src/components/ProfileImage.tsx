"use client"

import React, { useEffect, useState } from "react"
import { createClient } from "@/lib/client"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"

export default function ProfileImage() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function loadProfileImage() {
      const { data: userData, error: authError } = await supabase.auth.getUser()
      if (authError || !userData?.user) {
        console.error("Authentication failed:", authError?.message)
        return
      }

      const userId = userData.user.id

      // Fetch avatar_url
      const { data: profile, error: profileError } = await supabase
        .from("influencer_profiles")
        .select("avatar_url")
        .eq("user_id", userId)
        .single()

      if (profileError) {
        console.error("Failed to fetch profile:", profileError.message)
        setAvatarUrl(null)
      } else {
        setAvatarUrl(profile.avatar_url || null)
      }

    }

    loadProfileImage()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const src = avatarUrl || "" 

  return (
    <Avatar className='cursor-pointer w-10 h-10'>
      <AvatarImage src={src} className="w-10 h-10 rounded-full" />
      <AvatarFallback className='rounded-full relative bg-gray-200 dark:bg-gray-700 flex items-center justify-center w-10 h-10'>
        <span className="absolute w-10 h-10 left-4 top-2 text-gray-400 dark:text-gray-500 sm-hidden">I</span>
      </AvatarFallback>
    </Avatar>
  )
}