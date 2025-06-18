"use client"
import React from 'react'
import { SidebarNav } from './SidebarNav'
import { LucideIcon, Users, Building2, Activity, Settings } from 'lucide-react'
import { Separator } from '@radix-ui/react-select'
// import HeaderSubComponent from './Admin/DashboardHeaderSub'
// import { ModeToggle } from './Darkmode'

export function SmNavItem () {

  interface NavItem {
    name: string
    icon: LucideIcon
    path: string
  }

  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: Users, path: '/dashboards/influencer' },
    { name: 'Community', icon: Building2, path: '/community' },
    { name: 'Marketplace', icon: Activity, path: '/marketplace' },
    { name: 'Settings', icon: Settings, path: '/dashboards/influencer/settings' },
  ]

  return (
    <div className="">
      <SidebarNav items={navItems} />
      <Separator />
      {/* <div className="flex lg:hidden md:hidden">
        <HeaderSubComponent />
        <ModeToggle />
      </div> */}
    </div>
  )
}

