"use client"
import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { motion } from 'framer-motion'
import { Bell, ChevronDown } from 'lucide-react'


const HeaderSubComponent = () => {
  return (
    <>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="relative cursor-pointer"
      >
        <Bell className="h-5 w-5 text-slate-400" />
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs flex items-center justify-center">
          3
        </span>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 cursor-pointer"
      >
        <Avatar>
          <AvatarImage src="/api/placeholder/32/32" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        <span className="hidden md:inline-block text-sm font-medium">Admin User</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </motion.div>
    </>
  )
}

export default HeaderSubComponent

