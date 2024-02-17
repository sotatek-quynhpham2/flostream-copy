'use client'

import { asUploadButton } from '@rpldy/upload-button'
import { useBatchAddListener, useBatchFinishListener } from '@rpldy/uploady'
import { forwardRef } from 'react'

import FilePlusIcon from '@/assets/icons/file-plus.svg'
import Image from 'next/image'

interface Props {
  onChange: (listFile: string[]) => void
}

const UploadField = asUploadButton<Props, HTMLDivElement>(
  forwardRef<HTMLDivElement, Props>(function UploadFieldBtn({ onChange, ...props }, ref) {
    return (
      <div {...props} ref={ref} id='form-upload-button'>
        <Image src={FilePlusIcon} width={48} height={48} alt='FilePlusIcon' />
        <span className='text-primary text-[16px] font-medium'>Add file</span>
      </div>
    )
  })
)

export default UploadField
