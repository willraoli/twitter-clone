import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { trpc } from '../utils/trpc'

interface TweetFormProps {
  refetchFn: () => void
}

const TweetForm = ({ refetchFn }: TweetFormProps) => {
  const [text, setText] = useState<string>('')
  const { data: session } = useSession()
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }
  const { mutate: createTweet } = trpc.useMutation(['tweet.create'], {
    onSuccess: () => {
      setText('')
      refetchFn()
    },
  })
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload = {
      content: text,
    }
    createTweet(payload)
  }
  return (
    <form
      onSubmit={handleSubmit}
      className='p-4'
    >
      <div className='mb-2 flex items-center gap-2'>
        {session && (
          <Image
            src={session?.user?.image ?? '#'}
            width='48px'
            height='48px'
            className='rounded-full'
          />
        )}
        <textarea
          onChange={handleChange}
          value={text}
          className='h-20 w-full resize-none border border-neutral-300 p-2 text-lg'
          placeholder='O que está acontecendo?'
          maxLength={280}
          minLength={1}
        />
      </div>
      <div className='flex justify-end'>
        <button
          type='submit'
          className='rounded-3xl bg-blue-500 py-2 px-5 text-right font-semibold text-white transition-all hover:bg-blue-600 active:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-500'
          disabled={text.length === 0}
        >
          Tweetar
        </button>
      </div>
    </form>
  )
}

export default TweetForm
