import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className='flex'>
      <select name="model-selector" id="model-selector">
        <option value="gpt">GPT</option>
        <option value="claude">Claude</option>
        <option value="perplexity">Perplexity</option>
      </select>
      <div>
        <Link href="/signin">Sign In</Link>
        <Link href="/register">Register</Link>
      </div>
    </div>
  )
}

export default Navbar
