"use client"

import { useEffect, useState, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Calendar, Upload, Camera, ArrowRight, Globe } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/client'
import Image from 'next/image'

const IdentitySchema = z.object({
  avatar_url: z.string().optional(),
  fullName: z
  .string()
  .min(2, 'Full name is required')
  .regex(/^[a-zA-Z]+(?: [a-zA-Z]+)+$/, 'Please enter your full name'),
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

interface IdentityStepProps {
  onNext: () => void
  onSkip: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  containerVariants: any
  setFormError: (error: string | null) => void
  updateValidation?: (isValid: boolean) => void
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


export function IdentityStep({ onNext, onSkip, containerVariants, setFormError, updateValidation }: IdentityStepProps) {
  const [uploading, setUploading] = useState(false)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors }
  } = useForm<IdentityForm>({
    resolver: zodResolver(IdentitySchema),
    defaultValues: {
      fullName: '',
      country: '',
      birthdate: '',
      avatarFile: undefined,
      termsAccepted: false
    },
    mode: 'onChange'
  })

  // Watch all form values to check if all required fields are filled
  const watchedValues = watch()
  
  // Custom validation function to check if all required fields are filled
  const isFormComplete = useMemo((): boolean => {
    const hasFullName = Boolean(watchedValues.fullName && watchedValues.fullName.trim().length > 0)
    const hasCountry = Boolean(watchedValues.country && watchedValues.country.trim().length > 0)
    const hasBirthdate = Boolean(watchedValues.birthdate && watchedValues.birthdate.trim().length > 0)
    const hasTermsAccepted = watchedValues.termsAccepted === true
    
    return hasFullName && hasCountry && hasBirthdate && hasTermsAccepted
  }, [watchedValues.fullName, watchedValues.country, watchedValues.birthdate, watchedValues.termsAccepted])

  useEffect(() => {
    if (updateValidation) {
      updateValidation(isFormComplete)
    }
  }, [isFormComplete, updateValidation])

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
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to load countries:", err)
        setLoading(false)
      })
  }, [])

   
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const { data: userData, error: authError } = await supabase.auth.getUser();
      if (authError || !userData?.user) {
        setFormError("You must be logged in to continue.");
        setLoading(false);
        return;
      }
  
      const userId = userData.user.id;
  
      // Fetch profile data
      const { data: profile, error: profileError } = await supabase
        .from('influencer_profiles')
        .select('full_name, country, birthdate, avatar_url, terms_accepted')
        .eq('user_id', userId)
        .single();
  
      if (profileError) {
        setLoading(false);
        return;
      }
  
      if (profile) {
        // Prefill form fields
        setValue('fullName', profile.full_name || '');
        setValue('country', profile.country || '');
        setValue('birthdate', profile.birthdate || '');
        setValue('termsAccepted', profile.terms_accepted || false);
        
        // If avatar exists, set the preview
        if (profile.avatar_url) {
          setFilePreview(profile.avatar_url);
        }

        // Set validation to true since form is pre-filled
        if (updateValidation) {
          updateValidation(true);
        }
      }
      setLoading(false);
    }
  
    fetchProfile();
  }, [setValue, supabase, setFormError, updateValidation]);


  const onSubmit = async (data: IdentityForm) => {
  setFormError(null)

  const { data: userData, error: authError } = await supabase.auth.getUser()
  if (authError || !userData?.user) {
    setFormError("You must be logged in to continue.")
    return
  }

  const userId = userData.user.id
  let avatarUrl = ''

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
      return
    }

    const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(filePath)
    avatarUrl = publicData.publicUrl
    setUploading(false)
  }else {
    avatarUrl = data.avatar_url || filePreview || ''
  }
  

  // ✅ Upsert into database: inserts if not found
  const { error: profileError } = await supabase
    .from('influencer_profiles')
    .upsert({
      user_id: userId,
      full_name: data.fullName,
      country: data.country,
      birthdate: data.birthdate,
      avatar_url: avatarUrl || null,
      terms_accepted: true,
      accepted_at: new Date().toISOString()
      }, {
      onConflict: 'user_id' 
    })

  if (profileError) {
    setFormError("Failed to save your information. Please try again.")
    return
  }

  onNext()
}

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setValue('avatarFile', files)
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setFilePreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(files[0])
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
        key="identity-step"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.h2
          className="text-2xl font-bold mb-6 text-gray-900 dark:text-white"
          variants={contentVariants}
        >
          Let&apos;s get to know you
        </motion.h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <motion.div variants={contentVariants}>
          <input type="hidden" {...register('avatar_url')} value={watchedValues.avatar_url || filePreview || ''} />
            <Label htmlFor="fullName" className="text-base font-medium mb-1 block text-gray-700 dark:text-gray-200">Full Name</Label>
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
                className="text-red-500 text-sm mt-1 dark:text-red-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.fullName.message}
              </motion.p>
            )}
          </motion.div>

        <div className="block lg:flex md:flex gap-4 space-y-5 lg:space-y-0 md:space-y-0">
          {/* Country Select */}
          <motion.div variants={contentVariants} className='w-full'>
            <Label htmlFor="country" className="text-base font-medium mb-1 block">
              Country
            </Label>
          
            <div className="relative">
              {/* Icon inside the Select */}
                <Globe className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 ${errors.country ? "top-[35%]" : ""}`} />
          
              <Select
                value={watchedValues.country || ''}
                onValueChange={(value) => setValue('country', value)}
              >
                <SelectTrigger
                  id="country"
                  className="pl-10 py-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-lg w-full shadow-sm dark:shadow-md text-gray-900 dark:text-white"
                >
                  <SelectValue placeholder="Select a country..." />
                </SelectTrigger>
                <SelectContent className='dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 dark:border-slate-700'>
                  {loading ? (
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
                className="text-red-500 text-sm mt-1 dark:text-red-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >{errors.country.message}
              </motion.p>
              )}
            </div>
          </motion.div>

          {/* Birthdate */}
          <motion.div variants={contentVariants} className='w-full'>
            <Label htmlFor="birthdate" className="text-base font-medium mb-1 block text-gray-700 dark:text-gray-200">Birthdate</Label>
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
                className="text-red-500 text-sm mt-1 dark:text-red-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.birthdate.message}
              </motion.p>
            )}
          </motion.div>
        </div>

          {/* Profile Picture */}
          <motion.div variants={contentVariants}>
            <Label className="text-base font-medium mb-1 block text-gray-700 dark:text-gray-200">Profile Picture</Label>
            <div className="mt-2 flex items-center">
              <div className="relative">
                {filePreview ? (
                  <motion.div
                    className="w-16 h-16 lg:w-24 lg:h-24 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 mr-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring" }}
                  >
                    <Image
                      src={filePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                      width={50}
                      height={50}
                    />
                  </motion.div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-4">
                    <User className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
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
                  <span>Upload profile picture</span>
                </label>
                <input
                  id="avatarFile"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-gray-500 mt-2 ml-4 dark:text-gray-400">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Terms */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 gap-2 mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600"
            variants={contentVariants}
          >
            <Controller
              control={control}
              name="termsAccepted"
              render={({ field }) => (
                <Checkbox
                  id="termsAccepted"
                  checked={field.value}
                  onCheckedChange={field.onChange}
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

          {/* Submit Buttons */}
          <motion.div
            className="flex flex-wrap justify-end space-y-4 lg:space-y-0 md:space-y-0 items-center pt-4"
            variants={contentVariants}
          >
            <Button
              type="button"
              variant="ghost"
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700 hidden dark:text-gray-400 dark:hover:text-gray-200"
            >
              Skip for now
            </Button>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={uploading || !isFormComplete}
                className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg flex items-center space-x-2 text-base disabled:opacity-70"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Validation Status */}
          {!isFormComplete && (
            <motion.div
              className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Please complete all required fields to continue to the next step.
              </p>
            </motion.div>
          )}
        </form>
      </motion.div>
    </AnimatePresence>
  )
}