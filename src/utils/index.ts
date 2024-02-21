export function bytesToSize(bytes: number) {
  if (bytes === 0) return '0 MB'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function formatTimeUpload(s: number) {
  let minutes = ~~(s / 60)
  let seconds = ~~(s % 60)
  if (minutes === 0) {
    return seconds + 's'
  }
  return minutes + 'm' + seconds + 's'
}

export function renameFile(originalFile: File, newName: string) {
  return new File([originalFile], newName, {
    type: originalFile.type,
    lastModified: originalFile.lastModified
  })
}

export function sleep(time = 2000) {
  return new Promise((rel, rej) => {
    setTimeout(() => {
      rel(true)
    }, time)
  })
}
