import React from 'react'
import { AiFillLinkedin, AiFillGithub, AiFillInstagram } from 'react-icons/ai'

const Footer = () => {
  return (
    <div className='footer-container'>
        <p>2025 Miniature Car Store All rights reserved</p>
        <p className='icons'>
            <AiFillLinkedin/> 
            <AiFillGithub/> 
            <AiFillInstagram/>
        </p>
        
    </div>
  )
}

export default Footer