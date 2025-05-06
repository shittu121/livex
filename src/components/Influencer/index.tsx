"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle 
} from '@/components/ui/card'
import {
  // AreaChart,
  // Area,
  // BarChart,
  // Bar,
  // XAxis,
  // YAxis,
  // CartesianGrid,
  // Tooltip,
  // ResponsiveContainer,
  // PieChart,
  // Pie,
  // Cell,
  // Legend
} from 'recharts'
import {
  Users,
  Building2,
  // BarChart3,
  // UserPlus,
  Activity,
  // Calendar,
  Settings,
  // TrendingUp,
  DollarSign,
  // Star,
  Eye,
  // Bell,
  // MessageSquare
} from "lucide-react"
// import { 
//   Tabs,  
//   TabsList, 
//   TabsTrigger 
// } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

// // Mock data
// const revenueData = [
//   { name: 'Jan', value: 4000 },
//   { name: 'Feb', value: 3000 },
//   { name: 'Mar', value: 5000 },
//   { name: 'Apr', value: 7000 },
//   { name: 'May', value: 5000 },
//   { name: 'Jun', value: 6000 },
//   { name: 'Jul', value: 12345 },
// ];

// const campaignData = [
//   { name: 'Tech Co', value: 2500, status: 'Active' },
//   { name: 'Beauty Brand', value: 3500, status: 'Pending' },
//   { name: 'Fitness App', value: 4000, status: 'Active' },
//   { name: 'Fashion Store', value: 2000, status: 'Upcoming' },
//   { name: 'Food Delivery', value: 3000, status: 'Upcoming' },
// ];

// const engagementData = [
//   { name: 'Instagram', value: 45 },
//   { name: 'TikTok', value: 30 },
//   { name: 'YouTube', value: 25 },
// ];

// const COLORS = ['#4F46E5', '#10B981', '#F59E0B'];

export default function InfluencerDashboard() {
  // const [loading, setLoading] = useState(false)
  const [activeView, setActiveView] = useState('overview')
  const [timeFilter, setTimeFilter] = useState('7d')

  return (
    <div className="min-h-screen dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 bg-gradient-to-br from-white to-slate-100 dark:text-white text-slate-600">
      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-700 p-4"> 
          <nav className="space-y-1 mt-6">
            {[
              { name: 'Dashboard', icon: Users, view: 'overview' },
              { name: 'Community', icon: Building2, view: 'community' },
              { name: 'Marketplace', icon: Activity, view: 'marketplace' },
              { name: 'Settings', icon: Settings, view: 'settings' },
            ].map((item) => (
              <motion.button
                key={item.view}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveView(item.view)}
                className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                  activeView === item.view 
                    ? 'bg-indigo-600 text-white' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-300'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </motion.button>
            ))}
          </nav>

          <div className="mt-auto">
            <Card className="bg-indigo-900 border-indigo-800 fixed bottom-4 left-8">
              <CardContent className=" text-center">
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
              <h1 className="text-2xl lg:text-3xl font-bold">Influence Dashboard</h1>
              <p className="text-slate-400">Welcome back, here&apos;s what&apos;s happening today.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Select
                value={timeFilter}
                onValueChange={setTimeFilter}
              >
                <SelectTrigger className="w-32 dark:bg-slate-800 bg-gradient-to-br border-slate-200 dark:border-slate-700">
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


          {/* News & Announcements */}
          <motion.div variants={itemVariants} className="mb-6">
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle>News & Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                    <h3 className="font-bold text-lg">Welcome to LiveX</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Check out the latest features and updates on your dashboard.</p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                    <h3 className="font-bold text-lg">Get Certified</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Don&apos;t miss out on our VIP Priority Offer for RIVX Academy certification. Limited to the first 100 creators.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

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
                      {/* <p className="text-indigo-200 text-sm mt-1 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        +12% from last month
                      </p> */}
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
                      {/* <p className="text-emerald-200 text-sm mt-1 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Next campaign in 3 days
                      </p> */}
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
                      {/* <p className="text-amber-200 text-sm mt-1 flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        Top 10% of creators
                      </p> */}
                    </div>
                    <div className="bg-amber-500 p-2 rounded-lg">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Charts & Tables */}
          {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <motion.div 
              className="lg:col-span-2"
              variants={itemVariants}
            >
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Revenue Over Time</CardTitle>
                    <Tabs defaultValue="revenue" className="w-auto">
                      <TabsList className="bg-indigo-600 hover:bg-indigo-700 text-white border-none">
                        <TabsTrigger value="revenue">Revenue</TabsTrigger>
                        <TabsTrigger value="views">Views</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={revenueData}
                        margin={{
                          top: 5,
                          right: 10,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#e5e7eb" />
                        <YAxis stroke="#e5e7eb" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "#1e293b", 
                            border: "1px solid #334155",
                            borderRadius: '8px',
                            color: "#f1f5f9" 
                          }} 
                          formatter={(value) => [`$${value}`, 'Revenue']}
                        />
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#4F46E5" 
                          strokeWidth={2}
                          fill="url(#colorRevenue)" 
                          activeDot={{ r: 6 }} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                  <CardTitle>Platform Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={engagementData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {engagementData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div> */}

          {/* Campaign Table */}
          {/* <motion.div variants={itemVariants}>
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Upcoming Campaigns</CardTitle>
                  <Button className="bg-indigo-600 hover:bg-indigo-700" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-slate-400 border-b dark:border-slate-700">
                        <th className="pb-3 pl-4">Brand</th>
                        <th className="pb-3">Value</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaignData.map((campaign, index) => (
                        <tr key={index} className="border-b dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                          <td className="py-3 pl-4 font-medium">{campaign.name}</td>
                          <td className="py-3">${campaign.value}</td>
                          <td className="py-3">
                            <Badge className={
                              campaign.status === 'Active' ? 'bg-green-500' : 
                              campaign.status === 'Pending' ? 'bg-yellow-500' : 
                              'bg-blue-500'
                            }>
                              {campaign.status}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <Button variant="outline" size="sm" className="dark:border-slate-600 dark:text-slate-300">Details</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div> */}

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="mt-6">
            <h2 className="text-xl font-bold mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg">Join Our Discord</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Connect with other creators</p>
                  </div>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">OPEN DISCORD</Button>
                </CardContent>
              </Card>
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg">RIVX Academy</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Enhance your creator skills</p>
                  </div>
                  <Button className="bg-amber-600 hover:bg-amber-700">LEARN MORE</Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </motion.main>
      </div>
    </div>
  )
}