import { Box } from '@chakra-ui/react'
import useAuth from '@src/hooks/useFirebaseUser'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

type Props = {
  children: ReactNode
}

export const AuthGuard = ({ children }: Props) => {
  const { user, isLoading: loadingAuth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push('/signin')
    }
  }, [loadingAuth, user, router])

  if (loadingAuth) {
    return (
      <Box textAlign="center" w="full" pt="xl">
        Loading...
      </Box>
    )
  }

  return <>{children}</>
}
