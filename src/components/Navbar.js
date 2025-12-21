import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className='flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-800'>
      <select name="model-selector" id="model-selector" className='bg-black'>
        <option value="gpt">GPT</option>
        <option value="claude">Claude</option>
        <option value="perplexity">Perplexity</option>
      </select>
      <div>
        <Link href="/signin">Sign In</Link>
        <Link href="/register">Register</Link>
      </div>
    </nav>
  )
}

export default Navbar
