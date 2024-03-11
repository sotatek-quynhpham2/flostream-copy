'use client'

import DotIcon from '@/assets/icons/dot.svg'
import FilePlusIcon from '@/assets/icons/file-plus.svg'
import ReloadIcon from '@/assets/icons/reload.svg'
import SendIcon from '@/assets/icons/send.svg'
import TrashIcon from '@/assets/icons/trash.svg'
import { UploadIdItem } from '@/types'
import { bytesToSize, renameFile, sleep } from '@/utils'
import {
  BatchItem,
  useBatchAddListener,
  useChunkStartListener,
  useItemAbortListener,
  useItemFinishListener,
  useItemProgressListener,
  useUploadyContext
} from '@rpldy/chunked-uploady'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import JSZip from 'jszip'
import Image from 'next/image'
import { ChangeEvent, Dispatch, SetStateAction, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

interface UploadFormProps {
  fileList: BatchItem[]
  setFileList: Dispatch<SetStateAction<BatchItem[]>>
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
  uploadId: UploadIdItem[]
  setUploadId: Dispatch<SetStateAction<UploadIdItem[]>>
}

const limitSize = new BigNumber(20).times(Math.pow(2, 30))

const UploadForm = ({ setFileList, isLoading, setIsLoading, uploadId, setUploadId }: UploadFormProps) => {
  const { upload } = useUploadyContext()
  const inputFileRef = useRef<HTMLInputElement | null>(null)
  const [fileRawList, setFileRawList] = useState<{ id: string; file: File }[]>([])
  const [isCompressed, setIsCompressed] = useState(false)

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target?.files
    validateFile(files)
    event.target.value = ''
  }

  const validateFile = (files: FileList | null) => {
    const filesList: { id: string; file: File }[] = []
    let valid = true
    if (files) {
      for (const file of files) {
        if (new BigNumber(file.size).gte(limitSize)) {
          valid = false
          break
        }
        const id = uuidv4()
        filesList.push({
          id: uuidv4(),
          file: renameFile(file, `${id.slice(0, 10)}-${file.name}`)
        })
      }
      if (!valid) {
        return toast.error('file size must less than 20GB')
      }
      setFileRawList(filesList)
    }
  }

  useChunkStartListener((data) => {
    const uploadItem = uploadId.find((x) => x.fileName === data.item.file.name)
    console.log('useChunkStartListener', uploadItem, data);
    
    const sendOptions = {
      ...data.sendOptions,
      params: {
        partNumber: data.chunk.index + 1,
        uploadId: uploadItem?.uploadId
      }
    }
    return {
      sendOptions
    }
  })

  const hasFileUploaded = useMemo(() => fileRawList.length > 0, [fileRawList])

  useBatchAddListener((batch) => {
    setFileList((list) => list.concat(batch?.items || []))
  })

  useItemFinishListener(async (item) => {
    if (isCompressed) {
      setFileRawList([])
      setIsCompressed(false)
    } else {
      setFileRawList((list) => list.filter((x) => x.file.name !== item.file.name))
    }

    const uploadItem = uploadId.find((x) => x.fileName === item.file.name)

    const parts = item.uploadResponse.results
      .map((x: any) => ({
        ETag: x.data.ETag,
        PartNumber: x.data.partNumber
      }))
      .sort((a: any, b: any) => a.PartNumber - b.PartNumber)

    try {
      await axios.post('/api/complete-upload', {
        parts,
        key: item.file.name,
        UploadId: uploadItem?.uploadId
      })
    } catch (error) {}

    // setFileList((list) => {
    //   const newList = [...list]
    //   const index = list.findIndex((x) => x.id === item.id)
    //   newList[index] = item
    //   return newList
    // })
  })

  useItemProgressListener((item) => {
    setFileList((list) => {
      const newList = [...list]
      const index = list.findIndex((x) => x.id === item.id)
      newList[index] = { ...item }
      return newList
    })
  })

  useItemAbortListener((item) => {
    setFileList((list) => list.filter((x) => x.id !== item.id))
  })

  const onSubmit = async () => {
    if (isCompressed) {
      setIsLoading(true)
      const fileZip = await compressFiles()

      try {
        const res = await axios.post('/api/upload-id', {
          fileName: fileZip.name
        })
        setUploadId((prev) => [...prev, { fileName: res.data.data.Key, uploadId: res.data.data.UploadId }])
        await sleep(1000)
        setIsLoading(false)
        upload(fileZip)
      } catch (error) {
        setIsLoading(false)
      }
    } else {
      const fileName = fileRawList.map((item) => item.file.name)
      try {
        console.log(33333);
        
        setIsLoading(true)
        const uploadIds = await Promise.all(
          fileName.map((name) => {
            return axios.post('/api/upload-id', {
              fileName: name
            })
          })
        )

        setUploadId((prev) => [
          ...prev,
          ...uploadIds.map((x: any) => ({ fileName: x.data.data.Key, uploadId: x.data.data.UploadId }))
        ])
        setIsLoading(false)
        await sleep(1000)
        upload(fileRawList.map((x) => x.file))
      } catch (error) {
        setIsLoading(false)
      }
    }
  }

  const compressFiles = async () => {
    const zip = new JSZip() // instance of JSZip

    fileRawList.forEach((file) => {
      zip.file(file.file.name, file.file)
    })

    // Generate the zip file
    const zipData = await zip.generateAsync({
      type: 'blob',
      streamFiles: true
    })

    return new File([zipData], `zip-file-${uuidv4().slice(0, 10)}.zip`, {
      type: 'application/zip'
    })
  }

  const handleReset = () => {
    setFileRawList([])
  }

  const handleRemoveFile = (id: string) => {
    setFileRawList((list) => list.filter((x) => x.id !== id))
  }

  return (
    <div className='h-full bg-white rounded-xl md:rounded-r-[0px] p-6 md:px-[60px] md:py-[50px] md:shadow-[5px_0px_10px_0px_rgba(30,36,48,0.08)] md:z-[1] '>
      <div className='text-neutral-1 text-[18px] font-bold leading-normal uppercase'>Send</div>
      <input multiple type='file' onChange={onFileChange} ref={inputFileRef} className='hidden' />

      <div
        className='mt-3 border border-dashed border-primary rounded-xl bg-[#ffe9e140] p-[30px] flex flex-col justify-center items-center cursor-pointer'
        onDrag={(e) => e.preventDefault()}
        onDragOver={(e) => {
          e.preventDefault()
        }}
        onDrop={(e) => {
          e.preventDefault()
          validateFile(e.dataTransfer.files)
        }}
        onClick={() => (isLoading ? () => {} : inputFileRef.current?.click())}
      >
        <Image src={FilePlusIcon} width={48} height={48} alt='FilePlusIcon' />
        <span className='text-primary text-[16px] font-medium'>Add file</span>
      </div>

      {hasFileUploaded && (
        <div className='mt-6 flex flex-col gap-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 text-[16px] font-normal leading-normal'>
              <span className='text-neutral-2'>
                Total <strong>{fileRawList.length}</strong> {fileRawList.length === 1 ? 'file' : 'files'}
              </span>
              <div className='text-neutral-2 border-l border-neutral-4 pl-2'>
                <input
                  type='checkbox'
                  checked={isCompressed}
                  onChange={() => (isLoading ? () => {} : setIsCompressed(!isCompressed))}
                  className='mr-2'
                />
                <label
                  className='cursor-pointer'
                  onClick={() => (isLoading ? () => {} : setIsCompressed(!isCompressed))}
                >
                  Compressed?
                </label>
              </div>
            </div>
            <button
              className='flex items-center gap-2 text-info text-[16px] font-normal leading-normal'
              onClick={() => handleReset()}
            >
              <Image src={ReloadIcon} height={14} alt='ReloadIcon' />
              Reset
            </button>
          </div>

          {isCompressed && (
            <div className='text-neutral-2 text-[16px] font-normal leading-normal'>
              Your file(s) will be compressed into a zip file.
            </div>
          )}
          {!isCompressed && (
            <div className='text-neutral-2 text-[16px] font-normal leading-normal'>
              Your file(s) will be uploaded separately.
            </div>
          )}

          <div
            role='list'
            className='bg-neutral-5 rounded-xl px-5 py-4 flex flex-col gap-[10px] max-h-[200px] overflow-y-auto list-file'
          >
            {fileRawList.map(({ file, id }) => (
              <div className='border-t border-neutral-4 pt-[10px] first:border-none first:pt-0' key={id}>
                <div className='flex justify-between items-start'>
                  <div className='flex items-start gap-2'>
                    <Image src={DotIcon} height={24} alt='DotIcon' />
                    <div className='flex flex-col items-start'>
                      <span className='text-neutral-1 text-[16px] font-medium leading-normal flex '>
                        {file.name.length > 42 ? `${file.name.slice(0, 42)}...` : file.name}
                      </span>
                      <span className='text-neutral-2 text-[12px] font-normal leading-normal'>
                        {bytesToSize(file.size)}
                      </span>
                    </div>
                  </div>
                  <button disabled={isLoading} onClick={() => handleRemoveFile(id)} className='min-w-[24px]'>
                    <Image src={TrashIcon} height={24} alt='TrashIcon' />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            className='w-full h-10 rounded-[10px] bg-primary text-white text-[16px] font-medium flex items-center justify-center gap-1 disabled:bg-opacity-50 disabled:cursor-not-allowed'
            disabled={isLoading}
            onClick={onSubmit}
          >
            <Image src={SendIcon} height={24} alt='SendIcon' />
            Send
          </button>
        </div>
      )}
      <div className='mt-10 text-neutral-1 text-[18px] font-bold leading-normal uppercase'>Receive</div>
      <div className='mt-2 text-neutral-2 text-[14px] font-normal leading-normal'>
        Just paste the file link in the url of the browser to receive the file.
      </div>
    </div>
  )
}

export default UploadForm
