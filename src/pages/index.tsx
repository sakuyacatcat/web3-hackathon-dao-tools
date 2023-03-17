import {
  Button,
  Center,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react'
import { AuthGuard } from '@src/components/AuthGuard'
import { collection, getDocs, getFirestore } from 'firebase/firestore'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Idea {
  id: string
  idea: string
  author: string
  createdAt: string
}

export default function Home() {
  const [ideas, setIdeas] = useState<Idea[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore()
      const ideaCollection = collection(db, 'ideas')
      const ideaSnapshot = await getDocs(ideaCollection)
      const ideaList = ideaSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Idea[]
      setIdeas(ideaList)
    }
    fetchData()
  }, [])

  return (
    <AuthGuard>
      <Center>
        <VStack spacing={8}>
          <Heading size="lg" mb={4}>
            <Button colorScheme="teal" variant="outline" size="lg" mt={8}>
              <Link href="/ideas/new">
                自分のアイデアをプレスリリースで投稿する
              </Link>
            </Button>
          </Heading>
          <Grid templateColumns="repeat(2, 1fr)" gap={8}>
            {ideas.map((idea) => (
              <GridItem key={idea.id} colSpan={1}>
                <Link href={`/ideas/${idea.id}`}>
                  <Center
                    h="200px"
                    w="100%"
                    rounded="md"
                    boxShadow="md"
                    p={4}
                    bg="white"
                  >
                    <VStack spacing={4} alignItems="start">
                      <Heading size="md">{idea.idea}</Heading>
                      <Text>{idea.idea}</Text>
                      <Text fontSize="sm" color="gray.500">
                        投稿者: {idea.author}
                      </Text>
                    </VStack>
                  </Center>
                </Link>
              </GridItem>
            ))}
          </Grid>
        </VStack>
      </Center>
    </AuthGuard>
  )
}
