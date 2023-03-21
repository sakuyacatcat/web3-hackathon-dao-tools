import { Box, useToast } from '@chakra-ui/react'
import useAuth from '@src/hooks/useFirebaseUser'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

type Props = {
  children: ReactNode
}

export const AuthGuardAdmin = ({ children }: Props) => {
  const { user, isLoading: loadingAuth } = useAuth()
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    if (!loadingAuth) {
      if (!user) {
        router.push('/signin')
      } else if (user.role !== 'administrator') {
        router.back()
        toast({
          title: '操作を禁止されている権限です',
          status: 'error',
          position: 'top',
        })
      }
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
