import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export const Main = () => {
  const router = useRouter().pathname

  useEffect(() => {
    fetch('/api/test')
  }, [])

  return (
    <div id='main' className='use-tailwind text-teal-500'>Main</div>
  )
}