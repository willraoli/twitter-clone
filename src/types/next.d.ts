import type { NextComponentType } from 'next'
import type { Session } from 'next-auth'
import type {
  AppContextType,
  AppInitialProps,
  AppPropsType,
} from 'next/dist/shared/lib/utils'
import type { NextRouter } from 'next/router'

export {} // This is here to prevent `PageProps` at the bottom from being exposed

declare module 'next/app' {
  // Customized AppType by passing the props we expect in AppInitialProps and AppPropsType
  type CustomAppType = NextComponentType<
    AppContextType,
    AppInitialProps<PageProps>,
    AppPropsType<NextRouter, PageProps>
  >
}

type PageProps = { session?: Session }
