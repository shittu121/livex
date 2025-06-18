"use client"

import { useState, useRef, useEffect } from 'react'
import { Camera } from 'lucide-react'
import { createClient } from '@/lib/client'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'

export default function AvatarEditor() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [name, setName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // Fetch existing avatar on component mount
  useEffect(() => {
    fetchAvatar()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAvatar = async () => {
    try {
      const { data: userData, error: authError } = await supabase.auth.getUser()
      if (authError || !userData?.user) {
        return
      }

      const userId = userData.user.id

      // Fetch profile data
      const { data: profile, error: profileError } = await supabase
        .from('influencer_profiles')
        .select('avatar_url, full_name')
        .eq('user_id', userId)
        .single()

      if (profileError) {
        console.error('Failed to fetch profile:', profileError)
        return
      }

      if (profile?.avatar_url) {
        setAvatarUrl(profile.avatar_url)
      }
      setName(profile.full_name || 'N')
    } catch (error) {
      console.error('Failed to fetch avatar:', error)
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB')
      return
    }

    try {
      const { data: userData, error: authError } = await supabase.auth.getUser()
      if (authError || !userData?.user) {
        throw new Error("You must be logged in to upload files.")
      }

      const userId = userData.user.id
      const cleanFileName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '')
      const filePath = `avatars/${userId}/${cleanFileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        throw new Error("Failed to upload avatar. Please try again.")
      }

      // Get public URL
      const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const publicUrl = publicData.publicUrl

      // Update profile in database
      const { error: updateError } = await supabase
        .from('influencer_profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', userId)

      if (updateError) {
        throw new Error("Failed to update profile. Please try again.")
      }

      setAvatarUrl(publicUrl)
    } catch (error) {
      console.error('Upload failed:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload image. Please try again.')
    }
  }

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">      
      <div className="relative">
        <Avatar className="relative inline-block w-20 h-20">
          {/* Fallback Icon Always Rendered */}
          <AvatarFallback className="absolute inset-0 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-xl font-bold rounded-full z-0 border-4 border-indigo-500">
            <span className='bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-xl font-bold'>
            {name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </AvatarFallback>

          {/* Conditional Image Overlay */}
          {avatarUrl && (
            <AvatarImage
              src={avatarUrl}
              alt="Profile"
              className="relative z-10 w-20 h-20 rounded-full object-cover border-4 border-indigo-500"
            />
          )}
        </Avatar>

        {/* Camera Edit Button */}
        <button
          onClick={handleCameraClick}
          className="absolute -bottom-1 -right-1 bg-blue-500 z-10 hover:bg-blue-600 rounded-full p-2 shadow-lg transition-colors"
        >
          <Camera className="w-4 h-4 text-white" />
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  )
}