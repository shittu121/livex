import { checkRole } from '@/lib/checkRole'
import HeaderSubComponent from '@/components/Admin/DashboardHeaderSub'
import { SmSidebar } from '@/components/Sm-Sidebar'
import { Input } from '@/components/ui/input'
import { Search, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { redirect } from 'next/navigation'

import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/server'
import { ModeToggle } from '@/components/Darkmode'
import InfluencerSettings from '@/components/Influencer/Setting'
import ProfileImage from '@/components/ProfileImage'
import Image from 'next/image'


export default async function Settings() {
  await checkRole(['influencer']) 

  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  return ( 
    <div className='min-h-screen dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 bg-gradient-to-br from-white to-slate-100 dark:text-white text-slate-600 overflow-x-hidden'>
    <header className="flex items-center justify-between p-4 lg:p-6 border-b border-slate-200 dark:border-slate-700">
      <Image src="/livex-logo.svg" alt='logo' height={50} width={128} className='h-[50px] w-auto object-cover' />
      
      <div className="flex items-center gap-4 lg:gap-7">
        <div className="relative hidden md:block sm-hidden">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 dark:text-slate-400 text-black" />
          <Input 
            className="pl-10  to-slate-100 dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-200 w-64"
            placeholder="Search..." 
          />
        </div>

        <div className="sm-hidden">
        <HeaderSubComponent />
        </div>
        <div className="ml-1">
        <ModeToggle />
        </div>

        <div className="flex lg:hidden md:hidden">
          <SmSidebar />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className='sm-hidden'>
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-300">
                  <ProfileImage />
                  <div className="flex items-center cursor-pointer">
                      <span className="hidden md:inline-block text-sm font-medium">{data.user.email}</span>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-24 lg:w-56 mt-6 mr-6 lg:mr-0 md:mr-0 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 bg-gradient-to-br from-white to-slate-100 dark:text-white text-slate-600 ">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut className='sm-hidden'>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
            <LogoutButton />
              <DropdownMenuShortcut className='sm-hidden'>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
    <InfluencerSettings />
  </div>
    )
}
