import LoadingAnimation from '@/components/loading-animation'
import { checkRole } from '@/lib/checkRole'

export default async function Protected() {
  await checkRole(['']) 

  return (
    <div>
      <LoadingAnimation />
    </div>
  )
}
