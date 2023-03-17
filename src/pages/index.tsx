import { Center, Grid, GridItem, Heading, Text, VStack } from '@chakra-ui/react'
import { getDatabase, onChildAdded, ref } from '@firebase/database'
import { FirebaseError } from '@firebase/util'
import { useEffect, useState } from 'react'

export default function Home() {
  const [ideas, setIdeas] = useState<{ idea: string }[]>([])

  useEffect(() => {
    try {
      const db = getDatabase()
      const dbRef = ref(db, 'idea')
      return onChildAdded(dbRef, (snapshot) => {
        const idea = String(snapshot.val()['idea'] ?? '')
        setIdeas((prev) => [...prev, { idea }])
      })
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.error(e)
      }
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Center>
      <VStack spacing={8}>
        <Heading size="lg" mb={4}>
          事業アイデア一覧
        </Heading>
        <Grid templateColumns="repeat(2, 1fr)" gap={8}>
          {ideas.map((idea) => (
            <GridItem key={idea.idea} colSpan={1}>
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
                    投稿者: {idea.idea}
                  </Text>
                </VStack>
              </Center>
            </GridItem>
          ))}
        </Grid>
      </VStack>
    </Center>
  )
}
