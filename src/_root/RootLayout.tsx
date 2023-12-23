import Footer from '@/components/shared/Footer'
import Navbar from '@/components/shared/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className='w-full md:flex flex-col'>
        <Navbar />
        <section className='flex flex-1 h-full w-full'>
          <Outlet />
        </section>
        <Footer />
    </div>
  )
}

export default RootLayout