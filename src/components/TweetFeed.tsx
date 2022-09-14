import { Tweet, User } from '@prisma/client'
import TweetPost from './Tweet'

interface TweetFeedProps {
  tweets: (Tweet & { author: User })[]
  refetchFn: () => void
}

const TweetFeed = ({ tweets, refetchFn }: TweetFeedProps) => {
  return (
    <ul className='mt-2'>
      {tweets.map(tweet => (
        <TweetPost
          tweet={tweet}
          refetchFn={refetchFn}
          key={tweet.id}
        />
      ))}
    </ul>
  )
}

export default TweetFeed
