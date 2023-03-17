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
import { AuthGuard } from '@src/components/AuthGuard'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [idea, setIdea] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (idea.trim()) {
      router.push(`/ideas?search=${idea.trim()}`)
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
                検索
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
