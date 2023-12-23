import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
import { z } from 'zod'
import Loader from '@/components/shared/Loader'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { useSignInAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'
import { signInFormSchema } from '@/lib/validation'

const SignInForm = () => {
  const {toast} = useToast();
  const {checkAuthUser, isLoading: isUserLoading} = useUserContext();
  const navigate = useNavigate()

  const {mutateAsync: signInAccount} = useSignInAccount()

  const form = useForm<z.infer<typeof signInFormSchema>>({
      resolver: zodResolver(signInFormSchema),
      defaultValues: {
        email: "",
        password: "",
      },
    })

  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
      const session = await signInAccount({
          email: values.email,
          password: values.password
      })

      if(!session){
          return toast({
              title: 'Log in failed. Please try again.'
          })
      }

      const isLoggedIn = await checkAuthUser();
      if(isLoggedIn){
          form.reset();
          navigate('/')
      } else {
          return toast({title: 'Login failed. Please try again.'})
      }
  }

  return (
      <>
          <Form {...form}>
              <div className='sm:w-420 flex-col flex-center'>
                  <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>Login to Fabula</h2>
                  <p className='text-grey md:base-regular'>To use Fabula login using your details</p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-64 flex-col gap-5 mt-4">
                  <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                          <Input type='email' placeholder="Email address" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                          <Input type='password' placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <Button type="submit">
                      {
                          isUserLoading ? (
                              <div className='flex-center gap-2'>
                                  <Loader/> Loading...
                              </div>
                          ) : 'Login'
                      }
                  </Button>

                  <p className='text-small-regular text-grey text-center mt-2'>
                      Need an account?
                      <Link to='/register' className='text-complement text-small-semibold ml-1'>Register</Link>
                  </p>
              </form>
          </Form>
      </>
  )
}

export default SignInForm