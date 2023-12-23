/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
import { registerFormSchema } from '@/lib/validation'
import { z } from 'zod'
import Loader from '@/components/shared/Loader'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { useCreateUseAccount, useSignInAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'



const RegisterForm = () => {
    const {toast} = useToast();
    const {checkAuthUser, isLoading: isUserLoading} = useUserContext();
    const navigate = useNavigate()

    const {mutateAsync: createUserAccount, isPending: isCreatingUser} = useCreateUseAccount();
    const {mutateAsync: signInAccount, isPending: IsSigningIn} = useSignInAccount()

    const form = useForm<z.infer<typeof registerFormSchema>>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
          username: "",
          email: "",
          password: "",
        },
      })

    async function onSubmit(values: z.infer<typeof registerFormSchema>) {
        const newUser = await createUserAccount(values)
        if(!newUser){
            return toast({
                title: 'Login failed. Please try again.'
            })
        }
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
                    <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>Register for a new account</h2>
                    <p className='text-grey md:base-regular'>To use Fabula register your details</p>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-64 flex-col gap-5 mt-4">
                    <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input type='text' placeholder="Username" {...field} />
                        </FormControl>
                        <FormDescription>
                            This is your public display name.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
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
                            isCreatingUser ? (
                                <div className='flex-center gap-2'>
                                    <Loader/> Loading...
                                </div>
                            ) : 'Register'
                        }
                    </Button>

                    <p className='text-small-regular text-grey text-center mt-2'>
                        Already have an account?
                        <Link to='/sign-in' className='text-complement text-small-semibold ml-1'>Log in</Link>
                    </p>
                </form>
            </Form>
        </>
    )
}

export default RegisterForm