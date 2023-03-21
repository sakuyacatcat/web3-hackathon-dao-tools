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
import initializeFirebaseClient from '@src/configs/initFirebase'
import useFirebaseUser from '@src/hooks/useFirebaseUser'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'

export const Header = () => {
  const { db, auth } = initializeFirebaseClient()
  const { user, isLoading: loadingAuth } = useFirebaseUser()
  const router = useRouter()
  const toast = useToast()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast({
        title: 'ログアウトしました',
        status: 'success',
        position: 'top',
      })
      router.push('/signin')
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e)
      }
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
              isLoading={loadingAuth}
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
