import Footer from '@/components/shared/Footer'
import Navbar from '@/components/shared/Navbar'
import { useUserContext } from '@/context/AuthContext'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const RootLayout = () => {
  const { isAuthenticated } = useUserContext();
  return (
    <>
      {isAuthenticated ? (
              <div className='w-full md:flex flex-col'>
              <Navbar />
              <section className='flex flex-1 h-full w-full'>
                <Outlet />
              </section>
              <Footer />
          </div>
      ) :
        <Navigate to='/sign-in' />
      }
    </>
  )
}

export default RootLayout