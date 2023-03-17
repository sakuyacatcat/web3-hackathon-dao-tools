import {
    Box,
    Button,
    Center,
    Container,
    Heading,
    Input,
    Stack,
    Text
} from '@chakra-ui/react'
import { getDatabase, push, ref } from '@firebase/database'
import { FirebaseError } from '@firebase/util'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'

export const Idea = () => {
  const router = useRouter()
  const [idea, setIdea] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const db = getDatabase()
      const dbRef = ref(db, 'idea')
      await push(dbRef, {
        idea,
      })
      setIdea('')
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e)
      }
    }  }

  return (
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
  )
}

export default Idea
