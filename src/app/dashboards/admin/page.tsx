import Dashboard from '@/components/Admin'
import HeaderSubComponent from '@/components/Admin/DashboardHeaderSub'
import Navbar from '@/components/Navbar'
import { Input } from '@/components/ui/input'
import { checkRole } from '@/lib/checkRole'
import { Zap, Search } from 'lucide-react'

export default async function Admin() {
  await checkRole(['admin']) 

  return ( 
    <div className='min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white'>
      <header className="flex items-center justify-between p-4 lg:p-6 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-indigo-400" />
          <h1 className="text-xl font-bold">LiveX</h1>
        </div>
        <Navbar />
        
        <div className="flex items-center gap-7">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              className="pl-10 bg-slate-800 border-slate-700 text-slate-200 w-64"
              placeholder="Search..." 
            />
          </div>
          <HeaderSubComponent />
        </div>
      </header>
      <Dashboard />
    </div>
  )
}
