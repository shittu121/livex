import UserProfile from '@/components/UserProfile'
import { checkRole } from '@/lib/checkRole'

export default async function Influencer() {
  await checkRole(['influencer']) 

  return ( 
      <div>
        <UserProfile />
        <div className='p-5'>Influencer dashboard content</div>
      </div>
    )
}
