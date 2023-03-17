import { Box, Container, Heading, Text } from '@chakra-ui/react'
import { AuthGuard } from '@src/components/AuthGuard'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface Idea {
  id: string
  idea: string
  author: string
  createdAt: string
}

const IdeaDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const [idea, setIdea] = useState<Idea>()

  useEffect(() => {
    const fetchIdea = async () => {
      const db = getFirestore()
      const ideaRef = doc(db, 'ideas', id)
      const ideaSnapshot = await getDoc(ideaRef)
      setIdea(ideaSnapshot.data())
    }

    if (id) {
      fetchIdea()
    }
  }, [id])

  if (!idea) {
    return <div>Loading...</div>
  }

  return (
    <AuthGuard>
      <Container maxW="xl" py={12}>
        <Box boxShadow="lg" p={6} rounded="lg">
          <Heading size="xl"></Heading>
          <Text mt={4}>アイデア: {idea.idea}</Text>
          <Text mt={4}>作成者: {idea.author}</Text>
        </Box>
      </Container>
    </AuthGuard>
  )
}

export default IdeaDetail
