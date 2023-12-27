import { useUserContext } from '@/context/AuthContext';
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const AuthLayout = () => {
    const { isAuthenticated } = useUserContext();
    return (
        <>
            {isAuthenticated ? (
                <Navigate to='/' />
            ): (
                <>
                    <section className='flex flex-1 justify-center items-center py-10 flex-row'>
                        <Outlet />
                    </section>
                </>
            )}
        </>
    )
}

export default AuthLayout