import Navbar from '@/components/Navbar'
import { checkRole } from '@/lib/checkRole'

export default async function Influencer() {
  await checkRole(['influencer']) 

  return ( 
      <div>
        <Navbar />
        <div className='p-5'>Influencer dashboard content</div>
      </div>
    )
}
