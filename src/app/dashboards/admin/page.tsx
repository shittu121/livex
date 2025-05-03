import Navbar from '@/components/Navbar'
import { checkRole } from '@/lib/checkRole'

export default async function Admin() {
  await checkRole(['admin']) 

  return ( 
    <div>
      <Navbar />
      <div className='p-5'>Admin dashboard content</div>
    </div>
  )
}
