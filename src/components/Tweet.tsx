import { trpc } from '../utils/trpc'
import { Tweet, User } from '@prisma/client'
import Image from 'next/image'

interface TweetProps {
  tweet: Tweet & { author: User }
  refetchFn: () => void
}

const Tweet = ({
  tweet: { id, content, likes, author },
  refetchFn,
}: TweetProps) => {
  const { mutate: likeTweet } = trpc.useMutation(['tweet.like'], {
    onSuccess: () => {
      refetchFn()
    },
  })
  return (
    <li
      key={id}
      className='h-min-36 flex flex-col border-t p-4'
    >
      <div className='flex h-full place-items-start gap-2'>
        {author.image && (
          <div className='w-[48px]'>
            <Image
              src={author.image}
              height='48px'
              width='48px'
              layout='fixed'
              className='rounded-full'
            />
          </div>
        )}
        <div className='flex flex-col'>
          <a className='text-sm font-semibold'>@{author.name?.split(' ')[0]}</a>
          <p className='text-sm'>{content}</p>
        </div>
      </div>
      <div className='flex justify-end'>
        <button
          onClick={() => likeTweet({ id })}
          className='group'
        >
          <span className='mr-2 rounded-full p-1 group-hover:bg-rose-200'>
            ❤️
          </span>
          <span className='text-sm text-neutral-400 group-hover:text-rose-500'>
            {likes} like
            {(likes === 0 && 's') || (likes > 1 && 's')}
          </span>
        </button>
      </div>
    </li>
  )
}

export default Tweet
