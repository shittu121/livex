import Navbar from '@/components/Navbar'
import { checkRole } from '@/lib/checkRole'

export default async function Brand() {
  await checkRole(['brand']) 

  return ( 
      <div>
        <Navbar />
        <div className='p-5'>Brand dashboard content</div>
      </div>
    )
}
