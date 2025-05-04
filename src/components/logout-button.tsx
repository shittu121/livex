'use client'

import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    // Get the logged-in user first
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Delete session row from your sessions table
      await supabase.from('sessions').delete().eq('user_id', user.id)
    }
    
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return <Button onClick={logout} className='bg-slate-800 border-slate-700'>Logout</Button>
}
