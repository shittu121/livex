"use client"
import { JSX, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle 
} from '@/components/ui/card'
import {
  Users,
  Building2,
  Activity,
  Settings,
  DollarSign,
  Eye,
  Star,
  Calendar,
  ShoppingCart,
  HelpCircle
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import NeedHelp from '../need-help'
import { SidebarNav } from '@/components/SidebarNav'
import { LucideIcon } from 'lucide-react'
import { createClient } from "@/lib/client"
import CreatorProfileGlance from './CreatorProfileGlance'
import LoadingAnimation from '../loading-animation'
import RivxScoreExplainerModal from './RivxScoreExplainerModal';


interface NavItem {
  name: string
  icon: LucideIcon
  path: string
}

interface InfluencerProfile {
  rivx_score: number | null
  tier_name: string | null
  full_name: string | null
  vibe_style: string | null
  country: string | null
  accepted_at: string | null
  niche_tags: string[] | null
  ai_summary: string | null
}

// Function to get tier badge styling
const getTierBadgeStyle = (tierName: string | null) => {
  switch (tierName?.toLowerCase()) {
    case 'sliver':
      return 'bg-gray-400 hover:bg-gray-500'
    case 'diamond':
      return 'bg-blue-600 hover:bg-blue-700'
    case 'gold':
      return 'bg-yellow-600 hover:bg-yellow-700'
    case 'unqualified':
      return 'bg-gray-600 hover:bg-gray-700'
    default:
      return 'bg-gray-400 hover:bg-gray-500'
  }
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

const navItems: NavItem[] = [
  { name: 'Dashboard', icon: Users, path: '/dashboards/influencer' },
  { name: 'Community', icon: Building2, path: '/community' },
  { name: 'Marketplace', icon: Activity, path: '/marketplace' },
  { name: 'Settings', icon: Settings, path: '/dashboards/influencer/settings' },
]


export default function InfluencerDashboard(): JSX.Element {
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<string>('7d')

  const [rivx, setRivx] = useState<InfluencerProfile | null>(null)
  const [fullName, setFullName] = useState("")
  const [category, setCategory] = useState("")
  const [country, setCountry] = useState("")
  const [joinedDate, setJoinedDate] = useState<string>("")
  const [creatorBio, setCreatorBio] = useState<string>("")
  const [strenght, setStrenght] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animatedScore, setAnimatedScore] = useState<number>(0)
  const [isScoreAnimating, setIsScoreAnimating] = useState(false)

  const formatJoinedDate = (acceptedAt: string | null): string => {
  if (!acceptedAt) return ""
  
  const date = new Date(acceptedAt)
  
  // Option 1: Month Year format (e.g., "January 2023")
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  })
 }

 const createBioFromNicheTags = (nicheTags: string[] | null): string => {
  if (!nicheTags || nicheTags.length === 0) {
    return "Digital content creator passionate about creating engaging content and inspiring others."
  }
  
  const tagsList = nicheTags.join(', ')
  return `Digital content creator passionate about ${tagsList} and inspiring others through authentic storytelling.`
}

  useEffect(() => {
  async function loadProfile() {
    const supabase = createClient()
    const { data: userData, error: authError } = await supabase.auth.getUser()

    if (authError || !userData?.user) {
      console.error("Authentication failed")
      return
    }

    const userId = userData.user.id

    // Fetch RIVX score + tier from influencer_profiles
    const { data, error } = await supabase
      .from('influencer_profiles')
      .select('rivx_score, tier_name, full_name, vibe_style, country, accepted_at, niche_tags, ai_summary, has_onboarded')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error("Failed to fetch profile:", error.message)
      return
    }

    if (data) {
      setRivx(data)
      setFullName(data.full_name || "Name")
      setCategory(data.vibe_style || "Persona")
      setCountry(data.country || "Location")
      setJoinedDate(formatJoinedDate(data.accepted_at) || "At")
      setCreatorBio(createBioFromNicheTags(data.niche_tags))
      setStrenght(data.ai_summary || "")
      setLoading(false)
      // Start score animation after data is loaded
      if (data.rivx_score !== null) {
        animateScore(data.rivx_score)
      }
    }
  }

  loadProfile()
}, [])

// Animation function for RIVX score
const animateScore = (targetScore: number) => {
  setIsScoreAnimating(true)
  setAnimatedScore(0)
  
  const duration = 2000 // 2 seconds
  const steps = 60 // 60 steps for smooth animation
  const stepDuration = duration / steps
  
  let currentStep = 0
  
  const timer = setInterval(() => {
    currentStep++
    
    // Use easing function for smoother animation
    const progress = currentStep / steps
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    const currentScore = targetScore * easeOutQuart
    
    setAnimatedScore(parseFloat(currentScore.toFixed(2))) // Show 2 decimal places
    
    if (currentStep >= steps) {
      setAnimatedScore(targetScore) // Ensure exact final value
      clearInterval(timer)
      setIsScoreAnimating(false)
    }
  }, stepDuration)
}

  
  const rivxScore = rivx?.rivx_score ?? null
  const tierName = rivx?.tier_name ?? null
  

  return (
    <div className="dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 bg-gradient-to-br from-white to-slate-100 dark:text-white text-slate-600">
      {loading ? <LoadingAnimation className={`${loading ? '' : 'hidden'}`} /> : ''}
      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r min-h-screen border-slate-200 dark:border-slate-700 p-4"> 
          <SidebarNav items={navItems} />
          <NeedHelp />
        </aside>

        {/* Dashboard Content */}
        <motion.main 
          className="flex-1 p-6 overflow-y-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="block lg:flex md:flex space-y-4 items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Influence Dashboard</h1>
              <p className="text-slate-400">Welcome back, here&apos;s what&apos;s happening today.</p>
            </div>
            
            <div className="items-center gap-2 hidden">
              <Select
                value={timeFilter}
                onValueChange={setTimeFilter}
              >
                <SelectTrigger className="w-32 dark:bg-slate-800 bg-gradient-to-br border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent className='dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 dark:border-slate-700'>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Export</Button>
            </div>
          </div>

          {/* Alert Banner for Low RIVX Score */}
          {rivxScore !== null && rivxScore < 30 && (
            <motion.div variants={itemVariants} className="mb-6">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <h3 className="font-medium text-red-800 dark:text-red-200">LIVX Score Below Silver Threshold</h3>
                    <p className="text-sm text-red-600 dark:text-red-300">
                      Your current score is {rivxScore}. You need at least 30 points to qualify for Silver tier and live session applications.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* News & Announcements */}
          <motion.div variants={itemVariants} className="mb-6">
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle>News & Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                    <h3 className="font-bold text-lg">Welcome to LivX</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Check out the latest features and updates on your dashboard.</p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                    <h3 className="font-bold text-lg">Get Certified</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Don&apos;t miss out on our VIP Priority Offer for LIVX Academy certification. Limited to the first 100 creators.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* RIVX Score Section */}
          <motion.div 
            variants={itemVariants} 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  LIVX Score & Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {rivxScore !== null && tierName ? (
                      <>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <motion.div 
                              className="text-3xl font-bold text-indigo-600"
                              animate={isScoreAnimating ? { 
                                color: ["#4f46e5", "#7c3aed", "#4f46e5"]
                              } : {}}
                              transition={{ 
                                duration: 0.5,
                                repeat: isScoreAnimating ? Infinity : 0,
                                repeatType: "reverse"
                              }}
                            >
                              {animatedScore}
                              {isScoreAnimating && (
                                <motion.span
                                  className="ml-1 text-indigo-400"
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 0.8, repeat: Infinity }}
                                >
                                  ...
                                </motion.span>
                              )}
                            </motion.div>
                            {!isScoreAnimating && (
                              <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.3 }}
                                onClick={() => setIsModalOpen(true)}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors group"
                                title="How is my LIVX Score calculated?"
                              >
                                <HelpCircle className="h-5 w-5 text-slate-400 hover:text-indigo-600 transition-colors" />
                              </motion.button>
                            )}
                          </div>
                          <motion.span 
                            className="text-sm text-slate-500 dark:text-slate-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isScoreAnimating ? 0 : 1 }}
                            transition={{ delay: 0.7, duration: 0.4 }}
                          >
                            LIVX Score
                          </motion.span>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ 
                            opacity: isScoreAnimating ? 0 : 1, 
                            scale: isScoreAnimating ? 0.8 : 1 
                          }}
                          transition={{ delay: 1.5, duration: 0.5 }}
                        >
                          <Badge className={`${getTierBadgeStyle(tierName)} text-white px-3 py-1 text-sm font-medium`}>
                            {tierName.charAt(0).toUpperCase() + tierName.slice(1)} Tier
                          </Badge>
                        </motion.div>
                      </>
                    ) : (
                      <div className="text-center">
                        <div className="text-xl font-medium text-slate-500 dark:text-slate-400">No Score Available</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Request your LIVX evaluation</div>
                      </div>
                    )}
                  </div>
                                   
                  <div className="flex flex-wrap gap-2">
                    {rivxScore !== null && tierName ? (
                      <>
                        {/* <Link href="/my-profile">
                          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Edit My Profile
                          </Button>
                        </Link> */}
                        {rivxScore !== null && rivxScore >= 30 ? (
                          <Button className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white flex flex-wrap items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className='sm-hidden'>You&apos;re eligible to</span>Apply to Live Sessions
                          </Button>
                        ) : (
                          <Button disabled className="w-full md:w-auto bg-gray-400 cursor-not-allowed text-white flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Reach Silver Tier to Apply
                          </Button>
                        )}
                        <Button className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Explore Live Sessions
                        </Button>
                        <Button className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          Explore Marketplace
                        </Button>
                      </>
                    ) : (
                      <Button className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Request Score
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* RIVX Score Explainer Modal */}
          <RivxScoreExplainerModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />

          <CreatorProfileGlance 
            name={fullName}
            bio={creatorBio}
            location={country}
            joinedDate={joinedDate}
            category={category}
            strength={strenght}
          />

          {/* Stat Cards */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-indigo-600 to-indigo-700 border-indigo-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-indigo-200">Total Earnings</p>
                      <h2 className="text-3xl font-bold text-white">$12,345</h2>
                    </div>
                    <div className="bg-indigo-500 p-2 rounded-lg">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 border-emerald-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-emerald-200">Upcoming Campaigns</p>
                      <h2 className="text-3xl font-bold text-white">5</h2>
                    </div>
                    <div className="bg-emerald-500 p-2 rounded-lg">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-amber-600 to-amber-700 border-amber-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-amber-200">Engagement Rate</p>
                      <h2 className="text-3xl font-bold text-white">75%</h2>
                    </div>
                    <div className="bg-amber-500 p-2 rounded-lg">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="mt-6">
            <h2 className="text-xl font-bold mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-6 block space-y-3 lg:space-y-0 lg:flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg">Join Our Discord</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Connect with other creators</p>
                  </div>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto text-white">OPEN DISCORD</Button>
                </CardContent>
              </Card>
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-6 block space-y-3 lg:space-y-0 lg:flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg">LIVX Academy</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Enhance your creator skills</p>
                  </div>
                  <Button className="bg-amber-600 hover:bg-amber-700 w-full md:w-auto text-white">LEARN MORE</Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </motion.main>
      </div>
    </div>
  )
}