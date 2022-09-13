import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../server/db/client'

const getAllTweets = async (req: NextApiRequest, res: NextApiResponse) => {
  const tweets = await prisma.tweet.findMany({
    include: {
      author: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  res.status(200).json(tweets)
}

export default getAllTweets
