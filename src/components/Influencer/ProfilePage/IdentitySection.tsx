/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Calendar, Upload, Camera, Save, Globe } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/client'
import Image from 'next/image'
import Link from 'next/link'

const IdentitySchema = z.object({
  avatar_url: z.string().optional(),
  fullName: z.string().min(1, 'Full name is required'),
  country: z.string().min(1, 'Country is required'),
  birthdate: z.string().min(1, 'Birthdate is required'),
  avatarFile: typeof window !== 'undefined'
    ? z.instanceof(FileList).optional()
    : z.any().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the Terms of Service"
  })
})

type IdentityForm = z.infer<typeof IdentitySchema>

interface IdentitySectionProps {
  initialData: {
    fullName: string
    country: string
    birthdate: string
    avatar_url: string
    terms_accepted: boolean
  } | null
  onDataChange: (data: any) => void
  onSave: (data: any) => Promise<boolean>
  containerVariants: any
  setFormError: (error: string | null) => void
}

interface Country {
  code: string
  name: string
  flag: string
}

type RawCountry = {
  name: { common: string }
  cca2: string
  flags: { png: string }
}

export function IdentitySection({ 
  initialData, 
  onDataChange, 
  onSave, 
  containerVariants, 
  setFormError 
}: IdentitySectionProps) {
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filePreview, setFilePreview] = useState<string | null>(initialData?.avatar_url || null)
  const [countries, setCountries] = useState<Country[]>([])
  const [countriesLoading, setCountriesLoading] = useState(true)
  const [hasNewFile, setHasNewFile] = useState(false) // Track if user uploaded new file
  const supabase = createClient()

  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<IdentityForm>({
    resolver: zodResolver(IdentitySchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
      country: initialData?.country || '',
      birthdate: initialData?.birthdate || '',
      avatar_url: initialData?.avatar_url || '',
      avatarFile: undefined,
      termsAccepted: initialData?.terms_accepted || false
    },
    mode: 'onChange'
  })

  const watchedValues = watch()

  // Load countries
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flags')
      .then(res => res.json())
      .then((data: RawCountry[]) => {
        const countryList = data
          .map(country => ({
            name: country.name.common,
            code: country.cca2,
            flag: country.flags.png
          }))
          .sort((a, b) => a.name.localeCompare(b.name))

        setCountries(countryList)
        setCountriesLoading(false)
      })
      .catch(err => {
        console.error("Failed to load countries:", err)
        setCountriesLoading(false)
      })
  }, [])

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setValue('fullName', initialData.fullName)
      setValue('country', initialData.country)
      setValue('birthdate', initialData.birthdate)
      setValue('avatar_url', initialData.avatar_url)
      setValue('termsAccepted', initialData.terms_accepted)
      // Only update preview if user hasn't uploaded a new file
      if (!hasNewFile) {
        setFilePreview(initialData.avatar_url)
      }
    }
  }, [initialData, setValue, hasNewFile])

  // Notify parent of changes
  useEffect(() => {
    if (isDirty) {
      const currentData = {
        fullName: watchedValues.fullName,
        country: watchedValues.country,
        birthdate: watchedValues.birthdate,
        avatar_url: watchedValues.avatar_url || filePreview || '',
        terms_accepted: watchedValues.termsAccepted
      }
      onDataChange(currentData)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues.fullName, watchedValues.country, watchedValues.birthdate, watchedValues.avatar_url, watchedValues.termsAccepted, filePreview, isDirty])

  const onSubmit = async (data: IdentityForm) => {
    setFormError(null)
    setSaving(true)

    try {
      const { data: userData, error: authError } = await supabase.auth.getUser()
      if (authError || !userData?.user) {
        setFormError("You must be logged in to continue.")
        setSaving(false)
        return
      }

      const userId = userData.user.id
      let avatarUrl = data.avatar_url || filePreview || ''

      // Handle avatar upload
      if (data.avatarFile && data.avatarFile.length > 0) {
        setUploading(true)
        const file = data.avatarFile[0]

        const cleanFileName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '')
        const filePath = `avatars/${userId}/${cleanFileName}`

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { upsert: true })

        if (uploadError) {
          setFormError("Failed to upload avatar. Please try again.")
          setUploading(false)
          setSaving(false)
          return
        }

        const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(filePath)
        avatarUrl = publicData.publicUrl
        setUploading(false)
      }

      const formData = {
        fullName: data.fullName,
        country: data.country,
        birthdate: data.birthdate,
        avatar_url: avatarUrl,
        terms_accepted: data.termsAccepted
      }

      const success = await onSave(formData)
      if (success) {
        setFilePreview(avatarUrl)
        setValue('avatar_url', avatarUrl)
        setHasNewFile(false) // Reset after successful save
      }
    } catch (error) {
      console.error('Error saving identity:', error)
      setFormError("An unexpected error occurred. Please try again.")
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        setFormError("File size must be less than 2MB.")
        e.target.value = '' // Clear the input
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormError("Please select a valid image file.")
        e.target.value = '' // Clear the input
        return
      }

      // Clear any previous errors
      setFormError(null)
      
      // Set form data
      setValue('avatarFile', files, { shouldDirty: true })
      setHasNewFile(true)
      
      // Create preview immediately
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          const previewUrl = event.target.result as string
          setFilePreview(previewUrl)
          // Update the avatar_url in the form as well for consistency
          setValue('avatar_url', previewUrl, { shouldDirty: true })
        }
      }
      reader.onerror = () => {
        setFormError("Failed to read the selected file.")
      }
      reader.readAsDataURL(file)
    }
  }

  // Function to clear the avatar
  const clearAvatar = () => {
    setFilePreview(null)
    setValue('avatarFile', undefined, { shouldDirty: true })
    setValue('avatar_url', '', { shouldDirty: true })
    setHasNewFile(false)
    // Clear the file input
    const fileInput = document.getElementById('avatarFile') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="identity-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          className="mb-6"
          variants={contentVariants}
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Personal Information
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Update your personal details and profile picture.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Picture */}
          <motion.div variants={contentVariants}>
            <Label className="text-base font-medium mb-3 block text-gray-700 dark:text-gray-200">
              Profile Picture
            </Label>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <AnimatePresence mode="wait">
                  {filePreview ? (
                    <motion.div
                      key="avatar-preview"
                      className="w-16 h-16 lg:w-24 lg:h-24 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: "spring", duration: 0.3 }}
                    >
                      <Image
                        src={filePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                        width={96}
                        height={96}
                        unoptimized={hasNewFile} // Use unoptimized for local file previews
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="avatar-placeholder"
                      className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: "spring", duration: 0.3 }}
                    >
                      <User className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.label
                  htmlFor="avatarFile"
                  className="absolute -bottom-2 -right-2 bg-blue-500 dark:bg-blue-600 rounded-full p-2 cursor-pointer shadow-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Camera className="h-4 w-4 text-white" />
                  <span className="sr-only">Upload avatar</span>
                </motion.label>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="avatarFile"
                  className="flex items-center px-4 py-3 bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  <span>Upload new picture</span>
                </label>
                <input
                  id="avatarFile"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                  {filePreview && (
                    <motion.button
                      type="button"
                      onClick={clearAvatar}
                      className="text-xs text-red-500 hidden hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Remove
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Full Name */}
          <motion.div variants={contentVariants}>
            <input type="hidden" {...register('avatar_url')} value={watchedValues.avatar_url || filePreview || ''} />
            <Label htmlFor="fullName" className="text-base font-medium mb-2 block text-gray-700 dark:text-gray-200">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
              <Input
                id="fullName"
                placeholder="Your full name"
                className="pl-10 py-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-lg w-full shadow-sm dark:shadow-md text-gray-900 dark:text-white"
                {...register('fullName')}
              />
            </div>
            {errors.fullName && (
              <motion.p
                className="text-red-500 text-sm mt-2 dark:text-red-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.fullName.message}
              </motion.p>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Country Select */}
            <motion.div variants={contentVariants}>
              <Label htmlFor="country" className="text-base font-medium mb-2 block text-gray-700 dark:text-gray-200">
                Country
              </Label>
              <div className="relative">
                <Globe className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 z-10 ${errors.country ? "top-[35%]" : ""}`} />
                <Select
                  value={watchedValues.country || ''}
                  onValueChange={(value) => setValue('country', value, { shouldDirty: true })}
                >
                  <SelectTrigger
                    id="country"
                    className="pl-10 py-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-lg w-full shadow-sm dark:shadow-md text-gray-900 dark:text-white"
                  >
                    <SelectValue placeholder="Select a country..." />
                  </SelectTrigger>
                  <SelectContent className='dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 dark:border-slate-700 max-h-60'>
                    {countriesLoading ? (
                      <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                    ) : (
                      countries.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          <div className="flex items-center">
                            <Image
                              src={country.flag}
                              alt={`${country.name} flag`}
                              width={20}
                              height={15}
                              className="w-5 h-auto mr-2"
                            />
                            <span>{country.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <motion.p
                    className="text-red-500 text-sm mt-2 dark:text-red-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.country.message}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Birthdate */}
            <motion.div variants={contentVariants}>
              <Label htmlFor="birthdate" className="text-base font-medium mb-2 block text-gray-700 dark:text-gray-200">
                Birthdate
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                <Input
                  id="birthdate"
                  type="date"
                  className="pl-10 py-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-lg w-full shadow-sm dark:shadow-md text-gray-900 dark:text-white"
                  {...register('birthdate')}
                />
              </div>
              {errors.birthdate && (
                <motion.p
                  className="text-red-500 text-sm mt-2 dark:text-red-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.birthdate.message}
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Terms */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600"
            variants={contentVariants}
          >
            <Controller
              control={control}
              name="termsAccepted"
              render={({ field }) => (
                <Checkbox
                  id="termsAccepted"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                  className="h-5 w-5 border-2 data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-600 dark:text-white"
                />
              )}
            />
            <Label
              htmlFor="termsAccepted"
              className="text-sm cursor-pointer block text-gray-700 dark:text-gray-300 sm:leading-none leading-snug"
            >
              I accept the{' '}
              <span className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</span>{' '}
              and{' '}
              <span className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</span>
            </Label>
          </motion.div>

          {errors.termsAccepted && (
            <motion.p
              className="text-red-500 text-sm mt-1 dark:text-red-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.termsAccepted.message}
            </motion.p>
          )}

          {/* Save Button */}
          <motion.div
            className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700"
            variants={contentVariants}
          >
            <Link href="/dashboards/influencer">
              <Button
                type="button"
                variant="ghost"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Cancel
              </Button>
            </Link>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={uploading || saving || !isDirty}
                className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg flex items-center space-x-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading || saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{uploading ? 'Uploading...' : 'Saving...'}</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </motion.div>
    </AnimatePresence>
  )
}