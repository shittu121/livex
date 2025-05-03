import { checkRole } from '@/lib/checkRole'

export default async function Protected() {
  await checkRole(['']) 

  return <div className='flex'><span className='m-auto'>Verifying your role, just watch and wait.</span></div>
}
