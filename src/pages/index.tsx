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
      <main className='mx-auto min-h-screen max-w-xl border-x border-neutral-200'>
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
        <ul className='mt-2'>
          {tweetList?.map(tweet => (
            <li
              key={tweet.id}
              className='h-min-36 flex flex-col border-t p-4'
            >
              <div className='flex h-full place-items-start gap-2'>
                {tweet.author.image && (
                  <div className='w-[48px]'>
                    <Image
                      src={tweet.author.image}
                      height='48px'
                      width='48px'
                      layout='fixed'
                      className='rounded-full'
                    />
                  </div>
                )}
                <div className='flex flex-col'>
                  <a className='text-sm font-semibold'>
                    @{tweet.author.name?.split(' ')[0]}
                  </a>
                  <p className='text-sm'>{tweet.content}</p>
                </div>
              </div>
              <div className='flex justify-end'>
                <button
                  onClick={() => likeTweet({ id: tweet.id })}
                  className='group'
                  disabled={text.length === 0}
                >
                  <span className='mr-2 rounded-full p-1 group-hover:bg-rose-200'>
                    ❤️
                  </span>
                  <span className='text-sm text-neutral-400 group-hover:text-rose-500'>
                    {tweet.likes} like
                    {(tweet.likes === 0 && 's') || (tweet.likes > 1 && 's')}
                  </span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}

export default Home
