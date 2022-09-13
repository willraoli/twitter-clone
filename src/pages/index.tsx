import { Tweet, User } from '@prisma/client'
import type { NextPage } from 'next'
import { signIn, useSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { trpc } from '../utils/trpc'

interface HomeProps {
  tweets: (Tweet & { author: User })[]
}

const Home: NextPage<HomeProps> = ({ tweets }) => {
  const [tweetList, setTweetList] = useState(tweets)
  const [text, setText] = useState<string>('')
  const { data: session } = useSession()
  const { refetch: getAllTweets } = trpc.useQuery(['tweet.getAll'], {
    onSuccess(data) {
      setTweetList(data)
    },
  })
  const { mutate: createTweet } = trpc.useMutation(['tweet.create'], {
    onSuccess: () => {
      setText('')
      getAllTweets()
    },
  })
  const { mutate: likeTweet } = trpc.useMutation(['tweet.like'], {
    onSuccess: () => {
      getAllTweets()
    },
  })
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload = {
      content: text,
    }
    createTweet(payload)
  }

  if (!session) return <button onClick={() => signIn('google')}>Entrar</button>

  return (
    <>
      <Head>
        <title>Página Inicial / Twitter Clone</title>
        <meta
          name='description'
          content='Twitter Clone'
        />
        <link
          rel='icon'
          href='/twitter.svg'
        />
      </Head>
      <main className='mx-auto min-h-screen max-w-xl border-x-2 border-neutral-200 p-8'>
        <form onSubmit={handleSubmit}>
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
            />
          </div>
          <div className='flex justify-end'>
            <button
              type='submit'
              className='rounded-3xl bg-blue-500 py-2 px-5 text-right font-semibold text-white'
            >
              Tweetar
            </button>
          </div>
        </form>
        <ul className='mt-2'>
          {tweetList?.map(tweet => (
            <li
              key={tweet.id}
              className='flex h-36 items-start justify-between gap-2 border-y pt-4'
            >
              <div className='flex gap-4'>
                {tweet.author.image && (
                  <Image
                    src={tweet.author.image}
                    height='48px'
                    width='48px'
                    className='rounded-full'
                  />
                )}
                <div className='flex flex-col'>
                  <a className='text-sm font-semibold'>@{tweet.author.name}</a>
                  <span>{tweet.content}</span>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-neutral-400'>
                  {tweet.likes} likes
                </span>
                <button onClick={() => likeTweet({ id: tweet.id })}>❤️</button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}

export default Home
