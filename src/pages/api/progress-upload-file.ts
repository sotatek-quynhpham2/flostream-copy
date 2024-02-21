// import { formatTimeUpload } from '@/utils'
// import type { NextApiRequest, NextApiResponse } from 'next'
// import { getProgress } from './upload-file'

// async function GET(req: NextApiRequest, res: NextApiResponse) {
//   const data: any = {}

//   getProgress().forEach((progress) => {
//     const percent = Math.round(
//       ((progress?.progress?.loaded + progress?.progress?.total) / (progress?.progress?.total * 2)) * 100
//     )
//     const time = (Date.now() - progress.timeStart) / 1000
//     const dataLoaded = progress.progress.loaded / (1024 * 1024)
//     const speed = dataLoaded / time
//     const totalTime = formatTimeUpload((progress.progress.total / progress.progress.loaded) * time)

//     data[progress.fileName] = {
//       percent,
//       totalTime,
//       speed
//     }
//   })

//   return res.json({
//     data
//   })
// }

// export default GET
