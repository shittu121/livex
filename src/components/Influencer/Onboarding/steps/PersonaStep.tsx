"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Check, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/client'

interface Persona {
  id: string
  name: string
}

interface PersonaStepProps {
  onPrevious: () => void
  onNext: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  containerVariants: any
}

export default function PersonaStep({ onPrevious, onNext, containerVariants }: PersonaStepProps) {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const [profileData, setProfileData] = useState<any>(null)

  const supabase = createClient()

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
      } else {
        setProfileData(data)
        if (data) {
          setSelectedPersona(data.persona || null)
          setSelectedTags(data.niche_tags || [])
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
    { id: 'professional', name: 'Industry Expert' }
  ]

  // Niche tags
  const nicheTags = ['Fashion', 'Tech', 'Fitness', 'Travel', 'Food', 'Lifestyle']

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else if (selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleSubmit = async () => {
  if (!selectedPersona || selectedTags.length === 0) return

  const { data: userData, error: authError } = await supabase.auth.getUser()
  if (authError || !userData?.user) {
    return
  }

  const userId = userData.user.id

  const { error: saveError } = await supabase
    .from('influencer_profiles')
    .upsert({
      user_id: userId,
      persona: selectedPersona,
        niche_tags: selectedTags,
        vibe_style: personas.find(p => p.id === selectedPersona)?.name.toLowerCase() || '',
        ai_summary: `Generated summary about ${selectedPersona} persona with tags: ${selectedTags.join(', ')}`,
    }, {
      onConflict: 'user_id' 
    })


  if (saveError) {
    return
  }

  onNext()
}

  return (
    <motion.div
      key="step-1"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full flex flex-col"
    >
      <motion.h2 
        className="text-2xl font-bold mb-6"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
      >
        Define your persona
      </motion.h2>

      <motion.p 
        className="text-gray-700 dark:text-gray-300 mb-8 max-w-xl mx-auto"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
      >
        What do you want your audience to feel?
      </motion.p>

      {/* Personas */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15
            }
          }
        }}
      >
        {personas.map((persona) => (
          <motion.div
            key={persona.id}
            className={`p-5 rounded-lg border cursor-pointer transition-all ${
              selectedPersona === persona.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600'
                : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50'
            }`}
            onClick={() => setSelectedPersona(persona.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                selectedPersona === persona.id
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {selectedPersona === persona.id && <Check className="w-3 h-3 text-white" />}
              </div>
              <h3 className="font-semibold text-base">{persona.name}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Niche Tags */}
      <motion.div
        className="mb-10"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        }}
      >
        <h3 className="font-medium text-sm mb-3">Select up to 3 niches:</h3>
        <div className="flex flex-wrap gap-2">
          {nicheTags.map((tag) => (
            <motion.button
              type="button"
              key={tag}
              className={`px-4 py-2 rounded-full text-sm capitalize transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              onClick={() => toggleTag(tag)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tag}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div 
        className="w-full mx-auto pt-4 mt-auto flex flex-wrap space-y-4 lg:space-y-0 md:space-y-0 justify-center lg:justify-between md:justify-between sm:justify-between items-center"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        }}
      >
        <div className="flex space-x-6 lg:space-x-4 md:space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrevious}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
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
  
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
        <Button 
          onClick={handleSubmit}
          disabled={!selectedPersona || selectedTags.length === 0}
          className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg flex items-center space-x-2 text-base disabled:opacity-70"
        >
          <span>Continue</span>
          <ArrowRight className="h-5 w-5" />
        </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}