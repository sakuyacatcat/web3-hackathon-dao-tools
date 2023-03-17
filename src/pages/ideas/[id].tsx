import {
  Box,
  Button,
  chakra,
  Container,
  Flex,
  Heading,
  Input,
  Spacer,
  Text,
} from '@chakra-ui/react'
import { FirebaseError } from '@firebase/util'
import { AuthGuard } from '@src/components/AuthGuard'
import { useAuthContext } from '@src/lib/auth/AuthProvider'
import {
  arrayUnion,
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'

interface Idea {
  id: string
  headline: string
  summary: string
  issue: string
  solution: string
  creatorVoice: string
  howToStart: string
  customerVoice: string
  author: string
  timestamp: string
}

interface Reply {
  id: string
  message: string
  author: string
  timestamp: string
}

type MessageProps = {
  message: string
}

const Message = ({ message }: MessageProps) => {
  return (
    <Flex alignItems={'start'}>
      <Box ml={2}>
        <Text bgColor={'gray.200'} rounded={'md'} px={2} py={1}>
          {message}
        </Text>
      </Box>
    </Flex>
  )
}

const IdeaDetail = () => {
  const { user } = useAuthContext()
  const router = useRouter()
  const { id } = router.query
  const [idea, setIdea] = useState<Idea>()
  const [replies, setReplies] = useState<Reply[]>([])
  const [message, setMessage] = useState<string>('')
  const db = getFirestore()

  useEffect(() => {
    const fetchIdea = async () => {
      const ideaRef = doc(db, 'ideas', id)
      const unsubscribe = onSnapshot(ideaRef, (ideaSnapshot) => {
        setIdea(ideaSnapshot.data() as Idea)

        const repliesSnapshot = ideaSnapshot.data().replies
        const replyList = repliesSnapshot.map((reply, id) => ({
          id: id,
          message: reply.message,
          author: reply.author,
        }))
        setReplies(replyList)
      })
    }

    if (id) {
      fetchIdea()
    }
  }, [id])

  const handleSubmit = async (e: FormEvent<HTMLAllCollection>) => {
    e.preventDefault()
    try {
      await updateDoc(doc(db, 'ideas', id), {
        replies: arrayUnion({
          message: message,
          author: user?.email,
        }),
      })
      setMessage('')
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e)
      }
    }
  }
  if (!idea) {
    return <div>Loading...</div>
  }

  return (
    <AuthGuard>
      <Container maxW="xl" py={12}>
        <Box boxShadow="lg" p={6} rounded="lg">
          <Heading size="md">{idea.headline}</Heading>
          <Heading size="xs" mt={3}>
            サマリー
          </Heading>
          <Text mt={1} mb={3}>
            {idea.summary}
          </Text>
          <Heading size="xs" mt={3}>
            課題
          </Heading>
          <Text mt={1} mb={3}>
            {idea.issue}
          </Text>
          <Heading size="xs" mt={3}>
            解決策
          </Heading>
          <Text mt={1} mb={3}>
            {idea.solution}
          </Text>
          <Heading size="xs" mt={3}>
            発案者の声
          </Heading>
          <Text mt={1} mb={3}>
            {idea.creatorVoice}
          </Text>
          <Heading size="xs" mt={3}>
            使い方
          </Heading>
          <Text mt={1} mb={3}>
            {idea.howToStart}
          </Text>
          <Heading size="xs" mt={3}>
            顧客の声
          </Heading>
          <Text mt={1} mb={3}>
            {idea.customerVoice}
          </Text>
        </Box>
        <Spacer height={8} aria-hidden />
        <chakra.form display={'flex'} gap={2} onSubmit={handleSubmit}>
          <Input
            placeholder="カイゼン意見を伝えよう"
            size="lg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            aria-required
          />
          <Button size="lg" colorScheme="teal" type={'submit'}>
            送信
          </Button>
        </chakra.form>
        <Spacer height={4} aria-hidden />
        <Flex flexDirection={'column'} overflowY={'auto'} gap={2} height={400}>
          {replies.map((reply, index) => (
            <Message message={reply.message} key={`ChatMessage_${index}`} />
          ))}
        </Flex>
        <Spacer height={2} aria-hidden />
      </Container>
    </AuthGuard>
  )
}

export default IdeaDetail
