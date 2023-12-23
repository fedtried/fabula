import SideBar from '@/components/shared/SideBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const NookLayout = () => {
  return (
    <div className='flex w-full'>
        <SideBar/>
        <section className='flex flex-1 h-full'>
          <Outlet />
        </section>
    </div>
  )
}

export default NookLayout