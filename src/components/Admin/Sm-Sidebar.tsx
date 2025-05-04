"use client"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { motion } from "framer-motion"
import {
  BarChart3,
  Users,
  Building2,
  Activity,
  Calendar,
  Settings,
  BadgeCheck,
} from "lucide-react"
import { useEffect, useState } from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export function SmSidebar() {
  const [loading, setLoading] = useState(true)
  const [influencerCount, setInfluencerCount] = useState(0)
  const [brandCount, setBrandCount] = useState(0)
  const [adminCount, setAdminCount] = useState(0)
  const [activeView, setActiveView] = useState('overview')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const supabase = createClientComponentClient()

      const [
        { data: influencers },
        { data: brands },
        { data: admins },
      ] = await Promise.all([
        supabase.from('profiles').select('id').eq('role', 'influencer'),
        supabase.from('profiles').select('id').eq('role', 'brand'),
        supabase.from('profiles').select('id').eq('role', 'admin'),
      ])

      setInfluencerCount(influencers?.length || 0)
      setBrandCount(brands?.length || 0)
      setAdminCount(admins?.length || 0)
      setLoading(false)
    }

    fetchData()
  }, [])

  const navItems = [
    { name: 'Overview', icon: BarChart3, view: 'overview' },
    { name: 'Influencers', icon: Users, view: 'influencers' },
    { name: 'Brands', icon: Building2, view: 'brands' },
    { name: 'Admins', icon: BadgeCheck, view: 'admins' },
    { name: 'Activity', icon: Activity, view: 'activity' },
    { name: 'Calendar', icon: Calendar, view: 'calendar' },
    { name: 'Settings', icon: Settings, view: 'settings' },
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>
      <Image src="/hamburger.svg" alt="hamburger" width={50} height={50} />
      </SheetTrigger>
      <SheetContent>
        <aside className="flex w-full border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 h-screen">
          <nav className="space-y-2 mt-20 mx-auto w-full">
            {navItems.map((item) => (
              <motion.button
                key={item.view}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveView(item.view)}
                className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                  activeView === item.view
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>

                {!loading && item.view === 'influencers' && (
                  <Badge className="ml-auto bg-indigo-700">
                    {influencerCount}
                  </Badge>
                )}
                {!loading && item.view === 'brands' && (
                  <Badge className="ml-auto bg-emerald-700">
                    {brandCount}
                  </Badge>
                )}
                {!loading && item.view === 'admins' && (
                  <Badge className="ml-auto bg-yellow-700">
                    {adminCount}
                  </Badge>
                )}
              </motion.button>
            ))}
          </nav>
        </aside>
      </SheetContent>
    </Sheet>
  )
}
