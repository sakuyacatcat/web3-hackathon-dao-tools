import {
  Button,
  chakra,
  Container,
  Flex,
  Heading,
  Link,
  useToast,
} from '@chakra-ui/react'
import { FirebaseError } from '@firebase/util'
import { useAuthContext } from '@src/lib/auth/AuthProvider'
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useState } from 'react'

export const Header = () => {
  const { user } = useAuthContext()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const toast = useToast()
  const { push } = useRouter()

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      const auth = getAuth()
      await signOut(auth)
      toast({
        title: 'ログアウトしました',
        status: 'success',
        position: 'top',
      })
      push('/signin')
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <chakra.header py={4} bgColor={'blue.600'}>
      <Container maxW={'container.lg'}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading color={'white'}>
            <Link
              href="/"
              fontWeight="bold"
              textDecoration="none"
              _hover={{ textDecoration: 'none' }}
            >
              CREATION GATE!
            </Link>
          </Heading>
          {user ? (
            <Button
              colorScheme={'teal'}
              onClick={handleSignOut}
              isLoading={isLoading}
              ml={4}
            >
              サインアウト
            </Button>
          ) : (
            ''
          )}
        </Flex>
      </Container>
    </chakra.header>
  )
}
