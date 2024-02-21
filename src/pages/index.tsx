import { DefaultLayout as Layout } from '@/layouts/default'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'

const UploadMain = dynamic(() => import('@/components/UploadMain/UploadMain'), { ssr: false })

const HomePage: NextPage = () => {
  return (
    <Layout>
      <UploadMain />
    </Layout>
  )
}

export default HomePage
