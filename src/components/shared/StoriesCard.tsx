import { Models } from 'appwrite'
import React from 'react'

type CardProps = {
    story: Models.Document
}

const StoriesCard = ({story}: CardProps) => {
  return (
    <div className='story-card w-full'>
        <div className='flex flex-row justify-between'>
            <p className='header-text text-3xl'>{story.quote}</p>
            <p className='subtle-semibold lg:small-regular text-grey'>{story.date}</p>
        </div>
        <p>{story.writing}</p>
    </div>
  )
}

export default StoriesCard