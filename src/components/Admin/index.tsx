'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle 
} from '@/components/ui/card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  Users,
  Building2,
  BarChart3,
  UserPlus,
  Activity,
  Calendar,
  Settings
} from "lucide-react"
import { 
  Tabs,  
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import LoadingAnimation from '../loading-animation'

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

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05
    }
  }
}

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

// Interfaces
interface Profile {
  id: string
  full_name: string | null
  email: string | null
  role: 'brand' | 'influencer' | 'admin' | null
  created_at: string
  avatar_url?: string | null
}

interface ActivityLog {
  id: number
  user: string
  action: string
  time: string
  avatar?: string
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [influencerCount, setInfluencerCount] = useState(0)
  const [brandCount, setBrandCount] = useState(0)
  const [adminCount, setAdminCount] = useState(0)
  const [sessionCount, setSessionCount] = useState(0)
  const [todaySignups, setTodaySignups] = useState(0)
  const [signupChartData, setSignupChartData] = useState<{ name: string; value: number }[]>([])
  const [recentSignups, setRecentSignups] = useState<Profile[]>([])
  const [activityData, setActivityData] = useState<{ name: string; influencers: number; brands: number }[]>([])
  const [activeView, setActiveView] = useState('overview')
  const [timeFilter, setTimeFilter] = useState('7d')


  const userTypeData = [
    { name: 'Influencers', value: influencerCount, color: '#4F46E5' },
    { name: 'Brands', value: brandCount, color: '#10B981' },
    { name: 'Admins', value: adminCount, color: '#F59E0B' },
  ]

  

  const recentActivity: ActivityLog[] = [
    { id: 1, user: 'Emma Wilson', action: 'signed up as influencer', time: '5 min ago', avatar: '/api/placeholder/32/32' },
    { id: 2, user: 'Nike', action: 'created new campaign', time: '10 min ago', avatar: '/api/placeholder/32/32' },
    { id: 3, user: 'Jake Peterson', action: 'updated profile', time: '25 min ago', avatar: '/api/placeholder/32/32' },
    { id: 4, user: 'Adidas', action: 'sent 3 collaboration requests', time: '1 hour ago', avatar: '/api/placeholder/32/32' },
  ]

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const supabase = createClientComponentClient()
  
      const today = new Date()
      const todayDate = today.toISOString().split('T')[0]
      const pastWeek = new Date()
      pastWeek.setDate(pastWeek.getDate() - 7)
  
      // Parallel queries
      const [
        { data: influencers },
        { data: brands },
        { data: admins },
        { data: todayUsers },
        { data: weeklySignups },
        { data: recent }
      ] = await Promise.all([
        supabase.from('profiles').select('id').eq('role', 'influencer'),
        supabase.from('profiles').select('id').eq('role', 'brand'),
        supabase.from('profiles').select('id').eq('role', 'admin'),
        supabase.from('profiles').select('id').gte('created_at', todayDate),
        supabase.from('profiles').select('created_at').gte('created_at', pastWeek.toISOString()),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(8),
      ])
  
      // Count sessions
      const { count } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
  
      // Create signup chart data
      const weekdayMap: Record<string, number> = {
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
        Sun: 0,
      }
  
      weeklySignups?.forEach((signup) => {
        const day = new Date(signup.created_at).toLocaleDateString('en-US', {
          weekday: 'short',
        }) as keyof typeof weekdayMap
        weekdayMap[day] += 1
      })
  
      const realSignupData = Object.entries(weekdayMap).map(([name, value]) => ({
        name,
        value,
      }))
  
      // Generate activity data for last 7 days
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const tempData: { name: string; influencers: number; brands: number }[] = []
  
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(today.getDate() - i)
        const isoDate = date.toISOString().split('T')[0]
        const dayName = days[date.getDay()]
  
        const [influencersRes, brandsRes] = await Promise.all([
          supabase
            .from('profiles')
            .select('id')
            .eq('role', 'influencer')
            .gte('created_at', `${isoDate}T00:00:00`)
            .lte('created_at', `${isoDate}T23:59:59`),
  
          supabase
            .from('profiles')
            .select('id')
            .eq('role', 'brand')
            .gte('created_at', `${isoDate}T00:00:00`)
            .lte('created_at', `${isoDate}T23:59:59`),
        ])
  
        tempData.push({
          name: dayName,
          influencers: influencersRes.data?.length || 0,
          brands: brandsRes.data?.length || 0,
        })
      }
  
      // Set state
      setInfluencerCount(influencers?.length || 0)
      setBrandCount(brands?.length || 0)
      setAdminCount(admins?.length || 0)
      setTodaySignups(todayUsers?.length || 0)
      setRecentSignups(recent as Profile[])
      setSessionCount(count ?? 0)
      setSignupChartData(realSignupData)
      setActivityData(tempData)
  
      setLoading(false)
    }
  
    fetchData()
  }, [])
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {loading ? <LoadingAnimation className={`${loading ? '' : 'hidden'}`} /> : ''}
      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r border-slate-700 p-4 h-screen">
          <nav className="space-y-1 mt-6">
            {[
              { name: 'Overview', icon: BarChart3, view: 'overview' },
              { name: 'Influencers', icon: Users, view: 'influencers' },
              { name: 'Brands', icon: Building2, view: 'brands' },
              { name: 'Activity', icon: Activity, view: 'activity' },
              { name: 'Calendar', icon: Calendar, view: 'calendar' },
              { name: 'Settings', icon: Settings, view: 'settings' }
            ].map((item) => (
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
                {item.view === 'influencers' && (
                  <Badge className="ml-auto bg-indigo-700">
                    {influencerCount}
                  </Badge>
                )}
                {item.view === 'brands' && (
                  <Badge className="ml-auto bg-emerald-700">
                    {brandCount}
                  </Badge>
                )}
                {item.view === 'admins' && (
                  <Badge className="ml-auto hidden bg-emerald-700">
                    {adminCount}
                  </Badge>
                )}
              </motion.button>
            ))}
          </nav>

          <div className="mt-auto">
            <Card className="bg-indigo-900 border-indigo-800">
              <CardContent className="p-4">
                <h3 className="font-medium">Need help?</h3>
                <p className="text-xs text-indigo-300 mt-1">Check our documentation</p>
                <Button 
                  className="mt-3 w-full bg-indigo-700 hover:bg-indigo-800" 
                  size="sm"
                >
                  View Docs
                </Button>
              </CardContent>
            </Card>
          </div>
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
              <h1 className="text-2xl lg:text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-slate-400">Welcome back, here&apos;s what&apos;s happening today.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Select
                value={timeFilter}
                onValueChange={setTimeFilter}
              >
                <SelectTrigger className="w-32 bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-indigo-600 hover:bg-indigo-700">Export</Button>
            </div>
          </div>

          {/* Stat Cards */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-indigo-600 to-indigo-700 border-indigo-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100 font-medium">Influencers</p>
                      <motion.p 
                        className="text-3xl font-bold mt-1"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: 0.2
                        }}
                      >
                        {influencerCount}
                      </motion.p>
                      {/* <p className="text-xs text-indigo-200 mt-1">+14% from last week</p> */}
                    </div>
                    <div className="bg-indigo-500 p-3 rounded-full">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 border-emerald-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 font-medium">Brands</p>
                      <motion.p 
                        className="text-3xl font-bold mt-1"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: 0.3
                        }}
                      >
                        {brandCount}
                      </motion.p>
                      {/* <p className="text-xs text-emerald-200 mt-1">+5% from last week</p> */}
                    </div>
                    <div className="bg-emerald-500 p-3 rounded-full">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-amber-600 to-amber-700 border-amber-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100 font-medium">Sessions</p>
                      <motion.p 
                        className="text-3xl font-bold mt-1"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: 0.4
                        }}
                      >
                        {sessionCount}
                      </motion.p>
                      {/* <p className="text-xs text-amber-200 mt-1">+22% from last week</p> */}
                    </div>
                    <div className="bg-amber-500 p-3 rounded-full">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-rose-600 to-rose-700 border-rose-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-rose-100 font-medium shrink-0">New Signups</p>
                      <motion.p 
                        className="text-3xl font-bold mt-1"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: 0.5
                        }}
                      >
                        {todaySignups}
                      </motion.p>
                      {/* <p className="text-xs text-rose-200 mt-1">+9% from yesterday</p> */}
                    </div>
                    <div className="bg-rose-500 p-3 rounded-full">
                      <UserPlus className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Charts & Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <motion.div 
              className="lg:col-span-2"
              variants={itemVariants}
            >
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className='text-white'>User Signups Over Time</CardTitle>
                    <Tabs defaultValue="signups" className="w-auto">
                      <TabsList className="bg-slate-900">
                        <TabsTrigger value="signups">Signups</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={signupChartData}
                        margin={{
                          top: 5,
                          right: 10,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: 'none',
                            borderRadius: '8px',
                            color: '#f1f5f9' 
                          }} 
                        />
                        <defs>
                          <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#4F46E5" 
                          strokeWidth={2}
                          fill="url(#colorSignups)" 
                          activeDot={{ r: 6 }} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className='text-white'>User Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {userTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: 'none',
                            borderRadius: '8px',
                            color: '#f1f5f9' 
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    {userTypeData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-sm text-slate-300">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <motion.div 
              className="lg:col-span-2"
              variants={itemVariants}
            >
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className='text-white'>Recent Signups</CardTitle>
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="rounded-md max-h-96 overflow-auto"
                    variants={tableVariants}
                  >
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-900 text-slate-400">
                        <tr>
                          {/* <th className="px-4 py-3 text-left">Full Name</th> */}
                          <th className="px-4 py-3 text-left">Email</th>
                          <th className="px-4 py-3 text-left">Role</th>
                          <th className="px-4 py-3 text-left">Signup Date</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentSignups.length > 0 ? (
                          recentSignups.map((user) => (
                            <motion.tr 
                              key={user.id} 
                              className="border-b border-slate-700"
                              variants={rowVariants}
                            >
                              {/* <td className="px-4 py-3 flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={user.avatar_url || "/api/placeholder/24/24"} />
                                  <AvatarFallback className="text-xs">
                                    {user.full_name?.charAt(0) || '?'}
                                  </AvatarFallback>
                                </Avatar>
                                {user.full_name ?? '—'}
                              </td> */}
                              <td className="px-4 py-3 text-slate-300">{user.email ?? '—'}</td>
                              <td className="px-4 py-3">
                                <Badge className={`${
                                  user.role === 'influencer' ? 'bg-indigo-600 hover:bg-indigo-700' :
                                  user.role === 'brand' ? 'bg-emerald-600 hover:bg-emerald-700' :
                                  'bg-amber-600 hover:bg-amber-700'
                                }`}>
                                  {user.role}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-slate-400">{format(new Date(user.created_at), 'PP')}</td>
                              <td className="px-4 py-3 text-right">
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                  View
                                </Button>
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center py-4 text-slate-500">
                              No recent signups.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className='text-white'>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="space-y-4"
                    variants={tableVariants}
                  >
                    {recentActivity.map((activity) => (
                      <motion.div 
                        key={activity.id}
                        variants={rowVariants}
                        className="flex items-start gap-3 pb-3 border-b border-slate-700"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={activity.avatar} />
                          <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span>{' '}
                            <span className="text-slate-400">{activity.action}</span>
                          </p>
                          <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className='text-white'>User Growth Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activityData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: 'none',
                          borderRadius: '8px',
                          color: '#f1f5f9' 
                        }} 
                      />
                      <Bar dataKey="influencers" fill="#4F46E5" name="Influencers" />
                      <Bar dataKey="brands" fill="#10B981" name="Brands" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.main>
      </div>
    </div>
  )
}