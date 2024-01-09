import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export const Footer = () => {
  const router = useRouter().pathname

  return (
    <div id='footer'>Footer</div>
  )
}