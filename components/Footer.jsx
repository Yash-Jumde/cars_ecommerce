import Link from 'next/link'
import React from 'react'
import { AiFillLinkedin, AiFillGithub, AiFillInstagram } from 'react-icons/ai'

const Footer = () => {
  return (
    <div className='footer-container'>
        <p>2025 Miniature Car Store All rights reserved</p>
        <p className='icons'>
            <Link href='https://www.linkedin.com/in/yash-jumde/'><AiFillLinkedin/></Link> 
            <Link href='https://github.com/Yash-Jumde'><AiFillGithub/> </Link>
            <Link href='https://www.instagram.com/yash_jumde'><AiFillInstagram/></Link>
        </p>
        
    </div>
  )
}

export default Footer