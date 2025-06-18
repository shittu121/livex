"use client"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { SmNavItem } from "./SmNavItem"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { LogoutButton } from "./logout-button"
import ProfileImage from "./ProfileImage"
import { DropdownMenuShortcut } from "./ui/dropdown-menu"
import { createClient } from '@/lib/client' // Use client-side Supabase
import { useRouter } from "next/navigation"
import { User } from "@supabase/supabase-js"

export function SmSidebar() {
  const { theme } = useTheme()
  const router = useRouter()
  const [hasMounted, setHasMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setHasMounted(true)
    
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/auth/login')
        return
      }
      
      setUser(user)
      setIsLoading(false)
    }

    getUser()
  }, [router])

  if (isLoading) {
    return null
  }

  if (!user) {
    return null
  }

  return (
    <Sheet>
      <SheetTrigger asChild className="lg:hidden md:hidden">
        <button className="">
          <Image 
            src={!hasMounted ? "/hamburger.svg" : theme === "dark" ? "/hamburger.svg" : "/hamburger2.svg"} 
            alt="hamburger" 
            width={50} 
            height={50} 
          />
        </button>
      </SheetTrigger>
      <SheetContent className="lg:hidden md:hidden">
        <div className="flex flex-col h-full">
          <aside className="flex-1 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 bg-gradient-to-br from-white to-slate-100 dark:text-white text-slate-600 p-6">
            <nav className="space-y-2 mt-20">
              <SmNavItem />
              <Separator className="border-slate-200 dark:border-slate-600 my-4" />
              <div className="border-slate-200 dark:border-slate-700">
                <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-slate-800 dark:text-slate-300 w-full p-2 hover:cursor-pointer transition-colors">
                  <ProfileImage />
                  <div className="flex items-center gap-1 flex-1">
                    <span className="text-sm font-medium truncate">{user.email}</span>
                    <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 bg-gradient-to-br from-white to-slate-100 dark:text-white text-slate-600"
                align="end"
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href="/dashboards/influencer/settings">
                    <DropdownMenuItem className="cursor-pointer">
                      Profile
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <LogoutButton />
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </nav>
          </aside>
        </div>
      </SheetContent>
    </Sheet>
  )
}