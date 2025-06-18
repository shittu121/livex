"use client"
import { motion } from 'framer-motion'
import {
  Users,
  Building2,
  Activity,
  Settings
} from "lucide-react"
// import { Button } from "@/components/ui/button"
import NeedHelp from '../need-help'
import { SidebarNav } from '@/components/SidebarNav'
import { LucideIcon } from 'lucide-react'
import ProfileCompletion from './ProfileCompletion'

// Types
interface NavItem {
  name: string
  icon: LucideIcon
  path: string
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

export default function InfluencerSettings() {

  return (
    <div className="dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 bg-gradient-to-br from-white to-slate-100 dark:text-white text-slate-600">
      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r min-h-screen border-slate-200 dark:border-slate-700 p-4"> 
          <SidebarNav items={navItems} />
          <NeedHelp />
        </aside>

        {/* Settings Content */}
        <motion.main 
          className="flex-1 p-6 overflow-y-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Settings</h1>
              <p className="text-slate-400">Manage your account settings and preferences.</p>
            </div>
          </div>

          <div className="max-w-4xl">
            <motion.div variants={itemVariants} className="space-y-6">
              <ProfileCompletion />
            </motion.div>
          </div>
        </motion.main>
      </div>
    </div>
  )
}