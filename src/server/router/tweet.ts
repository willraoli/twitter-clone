import { createRouter } from './context'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const tweetRouter = createRouter()
  .query('getAll', {
    async resolve({ ctx }) {
      return ctx.prisma.tweet.findMany({
        include: {
          author: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    },
  })
  .mutation('create', {
    input: z.object({
      content: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { content } = input
      const user = ctx.session?.user

      const tweet = await ctx.prisma.tweet.create({
        data: {
          content,
          author: {
            connect: {
              id: user?.id,
            },
          },
        },
      })
      if (!tweet) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
        })
      }
      return tweet
    },
  })
  .mutation('like', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input

      const tweet = await ctx.prisma.tweet.update({
        where: {
          id,
        },
        data: {
          likes: {
            increment: 1,
          },
        },
      })
      if (!tweet) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
        })
      }
      return tweet
    },
  })
