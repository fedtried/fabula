import { Route, Routes } from 'react-router-dom';
import './globals.css';
import RegisterForm from './_auth/forms/RegisterForm';
import SignInForm from './_auth/forms/SignInForm';
import { Home, Writing, UpdateProfile } from './_root/pages';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import { Toaster } from './components/ui/toaster';
import NookLayout from './_root/pages/NookLayout';

const App = () => {
  return (
    <main className='flex h-screen'>
        <Routes>
            {/* public routes */}
            <Route element={<AuthLayout />}>
                <Route path='/sign-in' element ={<SignInForm />}/>
                <Route path='/register' element ={<RegisterForm />}/>
            </Route>

            {/* private routes */}
            <Route element={<RootLayout />}>
                <Route index element={<Home />}/>
                <Route path='/nook/:id' element={<NookLayout />}>
                  <Route path='/nook/:id/writing' element={<Writing />}/>
                  <Route path='/nook/:id/update-profile' element={<UpdateProfile />}/>
                </Route>
            </Route>

        </Routes>
        <Toaster />
    </main>
  )
}

export default App