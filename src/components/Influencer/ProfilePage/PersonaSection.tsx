/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Check, Save } from 'lucide-react'
import { createClient } from '@/lib/client'
import Link from 'next/link'

interface Persona {
  id: string
  name: string
}

interface PersonaStepProps {
  onDataChange: (data: any) => void
  onSave: (data: any) => Promise<boolean>
  containerVariants: any
  setFormError: (error: string | null) => void
}

interface PersonaData {
  persona: string
  niche_tags: string[]
  vibe_style: string
  ai_summary: string
}

export default function PersonaSection({ onDataChange, onSave, containerVariants, setFormError }: PersonaStepProps) {
  const [selectedPersona, setSelectedPersona] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [profileData, setProfileData] = useState<any>(null)
  const [originalData, setOriginalData] = useState<{ persona: string; tags: string[] } | null>(null)

  const supabase = createClient()

  // Fetch existing profile data
  useEffect(() => {
    async function fetchProfile() {
      const {
        data: userData,
        error: authError
      } = await supabase.auth.getUser()

      if (authError || !userData?.user) {
        return
      }

      const userId = userData.user.id

      const { data, error } = await supabase
        .from('influencer_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        // Handle error silently
      } else {
        setProfileData(data)
        if (data) {
          const persona = data.persona || ''
          const tags = data.niche_tags || []
          setSelectedPersona(persona)
          setSelectedTags(tags)
          setOriginalData({ persona, tags })
        }
      }
    }

    fetchProfile()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Example personas
  const personas: Persona[] = [
    { id: 'inspirational', name: 'Inspirational Mentor' },
    { id: 'funny', name: 'Comedic Entertainer' },
    { id: 'professional', name: 'Industry Expert' },
  ]

  // Niche tags
  const nicheTags = [
    'Fashion', 'Tech', 'Fitness', 'Travel', 'Food', 'Lifestyle',
  ]

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else if (selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  // Check for changes
  useEffect(() => {
    if (!originalData) {
      setHasChanges(selectedPersona !== '' || selectedTags.length > 0)
    } else {
      const personaChanged = selectedPersona !== originalData.persona
      const tagsChanged = JSON.stringify(selectedTags.sort()) !== JSON.stringify(originalData.tags.sort())
      setHasChanges(personaChanged || tagsChanged)
    }
  }, [selectedPersona, selectedTags, originalData])

  // Update parent component when data changes
  useEffect(() => {
    if (selectedPersona || selectedTags.length > 0) {
      const personaData: PersonaData = {
        persona: selectedPersona,
        niche_tags: selectedTags,
        vibe_style: personas.find(p => p.id === selectedPersona)?.name.toLowerCase() || '',
        ai_summary: selectedPersona && selectedTags.length > 0 
          ? `${personas.find(p => p.id === selectedPersona)?.name} focused on ${selectedTags.join(', ')}`
          : '',
      }
      onDataChange(personaData)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPersona, selectedTags])

  const handleSave = async () => {
    if (!selectedPersona || selectedTags.length === 0) return

    try {
      setSaving(true)
      setFormError(null)

      const personaData: PersonaData = {
        persona: selectedPersona,
        niche_tags: selectedTags,
        vibe_style: personas.find(p => p.id === selectedPersona)?.name.toLowerCase() || '',
        ai_summary: `${personas.find(p => p.id === selectedPersona)?.name} focused on ${selectedTags.join(', ')}`,
      }

      const success = await onSave(personaData)
      if (success) {
        setOriginalData({ persona: selectedPersona, tags: [...selectedTags] })
        setHasChanges(false)
      }
    } finally {
      setSaving(false)
    }
  }

  const isFormValid = selectedPersona && selectedTags.length > 0

  return (
    <motion.div
      key="step-1"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full flex flex-col"
    >
      <motion.div
        className="space-y-8 flex-1"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Define Your Persona
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Choose the persona that best represents how you want your audience to perceive you.
          </p>
        </div>

        {/* Personas Selection */}
        <motion.div
          className="mb-8"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Select Your Persona Style
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {personas.map((persona) => (
              <motion.div
                key={persona.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPersona === persona.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600'
                    : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50'
                }`}
                onClick={() => setSelectedPersona(persona.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPersona === persona.id
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {selectedPersona === persona.id && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {persona.name}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Niche Tags Selection */}
        <motion.div
          className="mb-8"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Select Your Niches (up to 3)
          </label>
          <div className="flex flex-wrap gap-2">
            {nicheTags.map((tag) => (
              <motion.button
                type="button"
                key={tag}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                } ${selectedTags.length >= 3 && !selectedTags.includes(tag) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => toggleTag(tag)}
                disabled={selectedTags.length >= 3 && !selectedTags.includes(tag)}
                whileHover={{ scale: selectedTags.length >= 3 && !selectedTags.includes(tag) ? 1 : 1.05 }}
                whileTap={{ scale: selectedTags.length >= 3 && !selectedTags.includes(tag) ? 1 : 0.95 }}
              >
                {tag}
              </motion.button>
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Selected: {selectedTags.length}/3 tags
          </p>
        </motion.div>

        {/* Selected Summary */}
        {selectedPersona && selectedTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6"
          >
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Your Persona Summary
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {personas.find(p => p.id === selectedPersona)?.name} focused on {selectedTags.join(', ')}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Save Button */}
      <motion.div 
        className="w-full pt-6 mt-auto flex items-center justify-between border-t border-gray-200 dark:border-gray-700"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        }}
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
          whileHover={{ scale: hasChanges && isFormValid && !saving ? 1.02 : 1.02 }}
          whileTap={{ scale: hasChanges && isFormValid && !saving ? 0.98 : 0.98 }}
        >
          <Button 
            onClick={handleSave}
            disabled={!hasChanges || !isFormValid || saving}
            className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg flex items-center space-x-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving...</span>
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
    </motion.div>
  )
}