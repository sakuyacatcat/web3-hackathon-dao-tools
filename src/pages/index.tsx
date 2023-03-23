import {
  Button,
  Center,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack
} from '@chakra-ui/react'
import { AuthGuard } from '@src/components/AuthGuard'
import useFirebaseUser from '@src/hooks/useFirebaseUser'
import { collection, getDocs, getFirestore } from 'firebase/firestore'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Idea {
  id: string
  headline: string
  subHeadline: string
  summary: string
  issue: string
  solution: string
  creatorVoice: string
  howToStart: string
  customerVoice: string
  author: string
  timestamp: string
}

export default function Home() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const { user } = useFirebaseUser()

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
          <Center mt={8}>
            <Heading size="2xl">The road to BE creation</Heading>
          </Center>
          <Center>
            <Text textAlign="center">
              CREATION GATE はアイデアを匿名で投稿できるSNSです
              <br />
              支持の厚いアイデアは BE creation の投資オファーを受けることも
              <br />
              投稿されたアイデアをディスカッションを通してカイゼンしましょう
            </Text>
          </Center>
          <Button colorScheme="teal" variant="outline" size="lg" mt={4}>
            <Link href="/ideas/new">
              自分のアイデアをプレスリリースで投稿する
            </Link>
          </Button>
          <Grid templateColumns="repeat(2, 1fr)" gap={8}>
            {ideas.map((idea) => (
              <GridItem key={idea.id} colSpan={1}>
                <Link href={`/ideas/${idea.id}`}>
                  <Center
                    h="250px"
                    rounded="md"
                    boxShadow="md"
                    p={4}
                    bg="white"
                  >
                    <VStack spacing={4} alignItems="start">
                      <Heading size="md">{idea.headline}</Heading>
                      <Text>{idea.summary}</Text>
                      <Text fontSize="sm" color="gray.500">
                        by {user?.role}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {user?.address}
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
