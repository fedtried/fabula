import Loader from "@/components/shared/Loader"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form"
import { HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from '@/components/ui/use-toast'
import { useUserContext } from "@/context/AuthContext"
import { useCreateStory, useGetPromptByDate, useGetStoryByDate } from "@/lib/react-query/queriesAndMutations"
import { storyFormSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { HoverCard } from "@radix-ui/react-hover-card"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

const Home = () => {
  const [date, setDate] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const {user} = useUserContext()
  const {toast} = useToast();
  const {data: story, isPending: isStoryLoading} = useGetStoryByDate(date, user.id)
  const form = useForm<z.infer<typeof storyFormSchema>>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      writing: "",
    },
  });
  const {mutateAsync: createStory, isPending: isLoadingCreate} = useCreateStory()
  const navigate = useNavigate()
  const {data: quote, isPending: isPromptsLoading} = useGetPromptByDate(date)

  useEffect(() => {
    const unparsed = new Date
    setDate(unparsed.toDateString())
  }, [])

  async function onSubmit (value: z.infer<typeof storyFormSchema>) {
    const newPost = await createStory({
      ...value,
      userId: user.id,
      date: date,
      quote: quote ? quote : ''
    });

    if (!newPost) {
      toast({
        title: `Story failed. Please try again.`,
      });
    }

    navigate(`/nook/${user.id}/writing`)
  }

  return (
    <>
          {!isPromptsLoading && story && story.total === 0 ? (
            <Form {...form}>
              <div className="home-container w-full">
              <div className='sm:w-420 flex-col flex-center'>
                    <h3 className='header-text text-grey'>{date}</h3>
                    <h1 className='header-text h1-semibold text-center'>"{quote}"</h1>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-64 flex-col gap-5 mt-4 w-full">
                    <FormField
                      control={form.control}
                      name="writing"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              onChangeCapture={(e) => {
                                const wc = !e.currentTarget.value.length ? 0 : e.currentTarget.value.split(' ').length
                                setWordCount(wc)
                              }}
                              placeholder="Write your story here"
                              className="shad-textarea w-full"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                   <p className="text-sm text-muted-foreground">
                     {wordCount} {wordCount > 1 ? `words` : `word`}
                   </p>
                   <HoverCard>
                      <HoverCardTrigger className="text-xs text-muted-foreground cursor-pointer hover:underline" >How does this work?</HoverCardTrigger>
                      <HoverCardContent className="text-xs text-muted-foreground">
                              Use the daily prompt to write a short story. In this mode, you only have 1 chance to save your work and then you're done for the day.
                      </HoverCardContent>
                    </HoverCard>
                    <Button type="submit" disabled={(wordCount < 5)}  className="max-w-sm flex-center m-auto">
                        {
                            isLoadingCreate ? (
                                <div className='flex-center gap-2'>
                                    <Loader/> Loading...
                                </div>
                            ) : 'Save'
                        }
                    </Button>
                </form>
              </div>
            </Form>
            ) : <>
              {isStoryLoading ? <Loader /> :
                (
                  <div className="flex-center m-auto flex-col gap-5">
                    <p className="header-text small text-grey">{date}</p>
                    <h1 className="h1-bold">You have already written todays story!</h1>
                    <h3>Come back again tomorrow to try out the next prompt</h3>
                    <p className="subtle-semibold text-grey">Or head over to your Nook to read through your old ones.</p>
                  </div>

                )
              }
            </>

            }
        </>
  )
}

export default Home