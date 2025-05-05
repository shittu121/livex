import UserProfile from '@/components/UserProfile'
import { checkRole } from '@/lib/checkRole'

export default async function Brand() {
  await checkRole(['brand']) 

  return ( 
      <div>
        <UserProfile />
        <div className='p-5'>Brand dashboard content</div>
      </div>
    )
}
