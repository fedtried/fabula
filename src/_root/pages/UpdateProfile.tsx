import Loader from '@/components/shared/Loader'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useUserContext } from '@/context/AuthContext'
import { useGetUserById, useUpdateUser } from '@/lib/react-query/queriesAndMutations'
import { updateProfileFormSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { z } from 'zod'

const UpdateProfile = () => {
  const {toast} = useToast();
  const { user, setUser } = useUserContext();
  const { id } = useParams();

  const { data: currentUser } = useGetUserById(id || "");
  const { mutateAsync: updateProfile, isPending: isLoadingUpdate} = useUpdateUser();

  const form = useForm<z.infer<typeof updateProfileFormSchema>>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: {
      username: user.username
    },
  })

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  async function onSubmit(values: z.infer<typeof updateProfileFormSchema>) {
    console.log(values)
    const updatedUser = await updateProfile({
      userId: currentUser!.$id,
      username: values.username
    })

    if(!updatedUser){
      return toast({
        title: 'Failed to update. Please try again.'
      })
    }

    setUser({
      ...user,
      username: updatedUser.username
    })
    console.log(updatedUser)
  }

  // async function deleteAccount(){
  //   const deletedAccount = await deleteUser(currentUser!.$id)
  // }

  return (
    <div className='flex flex-col flex-1 flex-center w-full'>
      <Form {...form}>
        <div className='sm:w-420 flex-col flex-center'>
            <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>Update Profile</h2>
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
            {/* <div className='border p-6 border-red-400 rounded-md flex flex-col gap-2'>
              <p>Want to remove your account?</p>
              <p className='subtle-semibold lg:small-regular text-grey'>This is a permenant action!</p>
              <Button variant="destructive" onClick={deleteAccount}>
                Delete my account forever
              </Button>
            </div> */}

            <Button type="submit"> {
              isLoadingUpdate ? <Loader /> : <span>Save</span>
            }
            </Button>
        </form>
      </Form>
    </div>
  )
}

export default UpdateProfile