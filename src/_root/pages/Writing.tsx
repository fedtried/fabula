
import Loader from '@/components/shared/Loader'
import StoriesCard from '@/components/shared/StoriesCard'
import { useUserContext } from '@/context/AuthContext'
import { useGetUserStories } from '@/lib/react-query/queriesAndMutations'
import { Models } from 'appwrite'

const Writing = () => {
  const {user} = useUserContext()
  const {data: stories, isPending: isStoriesLoading} = useGetUserStories(user.id)

  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
          <h2 className='h1-bold md:h2-bold text-left w-full header-text'>My Stories</h2>
          {isStoriesLoading && !stories ? (
            <Loader />
          ) : <>
            {stories && stories.total === 0 ? <p>You haven't written any stories!</p> :(
                  <ul className='flex flex-col flex-1 gap-9 w-full'>
                  {stories?.documents.map((story: Models.Document, i) => (
                    <StoriesCard key={i} story={story}/>
                  ))}
                </ul>
              )
            }
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default Writing