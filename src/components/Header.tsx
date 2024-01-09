import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export const Header = () => {
  const router = useRouter().pathname

  return (
    <div id='header'>Header</div>
  )
}
