import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from '@firebase/firestore'
import { FirebaseError } from '@firebase/util'
import { AuthGuard } from '@src/components/AuthGuard'
import { useAuthContext } from '@src/lib/auth/AuthProvider'
import { FormEvent, useState } from 'react'

export const Idea = () => {
  const { user } = useAuthContext()
  const [idea, setIdea] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const db = getFirestore()
      await addDoc(collection(db, 'ideas'), {
        idea,
        author: user?.email,
        createdAt: serverTimestamp(),
      })
      setIdea('')
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e)
      }
    }
  }

  return (
    <AuthGuard>
      <Container maxW="xl" py={12}>
        <Center mb={8}>
          <Heading size="2xl">アイデアをシェアしよう！</Heading>
        </Center>
        <Box boxShadow="lg" p={6} rounded="lg">
          <form onSubmit={handleSubmit}>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <Input
                placeholder="アイデアを入力"
                size="lg"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
              />
              <Button colorScheme="teal" size="lg" type="submit">
                投稿
              </Button>
            </Stack>
          </form>
          <Text mt={4} textAlign="center">
            「アイデアをシェアしよう！」はアイデアを投稿するSNSです。
            <br />
            登録不要で、誰でもアイデアを閲覧・投稿することができます。
          </Text>
        </Box>
      </Container>
    </AuthGuard>
  )
}

export default Idea
