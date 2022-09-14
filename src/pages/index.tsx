import TweetForm from '../components/TweetForm'
import { Tweet, User } from '@prisma/client'
import type { NextPage } from 'next'
import { signIn, useSession } from 'next-auth/react'
import Head from 'next/head'
import { useState } from 'react'
import { trpc } from '../utils/trpc'
import TweetFeed from '../components/TweetFeed'

const Home: NextPage = () => {
  const [tweetList, setTweetList] = useState<(Tweet & { author: User })[]>([])
  const { data: session } = useSession()
  const { refetch: getAllTweets } = trpc.useQuery(['tweet.getAll'], {
    onSuccess(data) {
      setTweetList(data)
    },
  })

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
        <TweetForm refetchFn={getAllTweets} />
        <TweetFeed
          tweets={tweetList}
          refetchFn={getAllTweets}
        />
      </main>
    </>
  )
}

export default Home
