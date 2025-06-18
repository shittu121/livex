"use client"
import { JSX } from 'react'
import { motion } from 'framer-motion'
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle 
} from '@/components/ui/card'
import {
  User,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  Instagram,
  Youtube,
  Facebook,
  ExternalLink,
  Camera,
  Heart,
  MessageCircle,
  ShoppingCart,
  Edit
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { IoLogoTiktok } from 'react-icons/io5'
import AvatarEditor from '../Avatar'

interface SocialPlatform {
  name: string
  handle: string
  followers: string
  icon: JSX.Element
  verified?: boolean
}

interface CreatorStats {
  totalFollowers: string
  avgEngagement: string
  completedCampaigns: number
  monthlyReach: string
}

interface CreatorProfileGlanceProps {
  profileImage?: string
  name: string
  bio?: string
  location?: string
  joinedDate?: string
  category?: string
  strength?: string
  socialPlatforms?: SocialPlatform[]
  stats?: CreatorStats
  isVerified?: boolean
  className?: string
}

// Animation variants
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

const defaultSocialPlatforms: SocialPlatform[] = [
  {
    name: "Instagram",
    handle: "@creator",
    followers: "125K",
    icon: <Instagram className="h-4 w-4" />,
    verified: true
  },
  {
    name: "YouTube",
    handle: "CreatorChannel",
    followers: "89K",
    icon: <Youtube className="h-4 w-4" />
  },
  {
    name: "Facebook",
    handle: "CreatorChannel",
    followers: "89K",
    icon: <Facebook className="h-4 w-4" />
  },
  {
    name: "Twitter",
    handle: "@creator",
    followers: "45K",
    icon: <IoLogoTiktok className="h-4 w-4" />
  }
]

const defaultStats: CreatorStats = {
  totalFollowers: "259K",
  avgEngagement: "8.5%",
  completedCampaigns: 23,
  monthlyReach: "1.2M"
}

export default function CreatorProfileGlance({
  name = "Creator Name",
  bio = "Digital content creator passionate about lifestyle, fashion, and inspiring others to live their best life.",
  location = "Los Angeles, CA",
  joinedDate = "January 2023",
  category = "Lifestyle & Fashion",
  strength = "Authentic Storytelling",
  socialPlatforms = defaultSocialPlatforms,
  stats = defaultStats,
  isVerified = true,
  className = ""
}: CreatorProfileGlanceProps): JSX.Element {

  return (
    <motion.div 
      variants={itemVariants} 
      className={`mb-6 ${className}`}
    >
      <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
        <CardHeader className="pb-4 flex flex-wrap items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-500" />
            My Creator Profile at a Glance
          </CardTitle>
          <Link href="/dashboards/influencer/my-profile" className='mt-2 lg:mt-0 md:mt-0 w-full md:w-auto'>
            <Button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit My Profile
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <AvatarEditor />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <h3 className="text-xl font-bold">{name}</h3>
                  {isVerified && (
                    <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    <Camera className="h-4 w-4" />
                    <span>{category}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{location}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {joinedDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="flex-1 lg:max-w-md">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {bio}
              </p>
              <div className="block lg:flex md:flex justify-between items-center w-full">
              <Link href="/dashboards/influencer/settings" className='w-full md:w-auto'>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 w-full md:w-auto border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Full Profile
              </Button>
              </Link>
              <Button className="bg-amber-600 mt-3 w-full md:w-auto hover:bg-amber-700 text-white flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Get Booked by Brands
              </Button>
            </div>
            
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {stats.totalFollowers}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Total Followers
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="h-5 w-5 text-pink-500" />
              </div>
              <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                {stats.avgEngagement}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Avg Engagement
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {stats.completedCampaigns}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Campaigns Done
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <MessageCircle className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {stats.monthlyReach}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Monthly Reach
              </div>
            </div>
          </div>

          {/* Strength */}
          {strength && (
            <div className='inline-block border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm'>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                Your Strength
              </h4>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {strength}
              </div>
            </div>
          )}

          {/* Social Media Platforms */}
          {socialPlatforms && socialPlatforms.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Connected Platforms
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 w-full">
                {socialPlatforms.map((platform, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between bg-slate-50 dark:bg-slate-700 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-slate-600 dark:text-slate-400 flex-shrink-0">
                        {platform.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium truncate">{platform.handle}</span>
                          {platform.verified && (
                            <Badge className="bg-blue-500 text-white px-1 py-0 text-xs h-4 flex-shrink-0">
                              ✓
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {platform.followers} followers
                        </div>
                      </div>
                    </div>
                    {/* <ExternalLink className="h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex-shrink-0 ml-2" /> */}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}