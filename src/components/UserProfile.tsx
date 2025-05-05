import { redirect } from 'next/navigation'

import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/server'

export default async function UserProfile() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <p className='sm-hidden md:hidden lg:flex'>
        Hello <span>{data.user.email}</span>
      </p>
      <LogoutButton />
    </div>
  )
}
