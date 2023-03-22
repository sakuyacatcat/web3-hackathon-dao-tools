import {
  Box,
  Button,
  chakra,
  Container,
  Flex,
  Heading,
  IconButton,
  Input,
  Link,
  Spacer,
  Text,
} from '@chakra-ui/react'
import { FirebaseError } from '@firebase/util'
import { AuthGuard } from '@src/components/AuthGuard'
import initializeFirebaseClient from '@src/configs/initFirebase'
import useFirebaseIdea from '@src/hooks/useFirebaseIdea'
import useFirebaseUser from '@src/hooks/useFirebaseUser'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'
import { FaHeart, FaMoneyCheckAlt } from 'react-icons/fa'

interface Reply {
  userUid: string
  message: string
  timestamp: Date
}

interface Support {
  userUid: string
  timestamp: Date
}

type ReplyMessageProps = {
  message: string
}

const ReplyMessage = ({ message }: ReplyMessageProps) => {
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
  const { db } = initializeFirebaseClient()
  const { user } = useFirebaseUser()
  const { idea } = useFirebaseIdea()
  const [replyMessage, setReplyMessage] = useState<string>('')
  const [replies, setReplies] = useState<Reply[]>([])
  const [supportNum, setSupportNum] = useState<number>(0)
  const [supported, setSupported] = useState<boolean>(false)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (idea !== null) {
      setReplies(idea.replies)
      setSupportNum(idea.supports.length)
      setSupported(
        idea.supports.some((support) => support.userUid === user?.uid)
      )
    }
  }, [idea])

  const handleSubmit = async (e: FormEvent<HTMLAllCollection>) => {
    e.preventDefault()
    try {
      await updateDoc(doc(db, 'ideas', id), {
        replies: arrayUnion({
          userUid: user?.uid,
          message: replyMessage,
          timestamp: new Date(),
        }),
      })
      setReplyMessage('')
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e)
      }
    }
  }

  const handleLike = async () => {
    if (supported === true) {
      return
    }

    try {
      await updateDoc(doc(db, 'ideas', id), {
        supports: arrayUnion({
          userUid: user?.uid,
          timestamp: new Date(),
        }),
      })
      setSupportNum(supportNum + 1)
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
          <Flex justifyContent="space-between" alignItems="center">
            <Heading size="md">{idea.headline}</Heading>
            <Heading size="xs" ml={4}>
              {supportNum >= 20 ? (
                <Link
                  href={'/ideas/' + id + '/fund'}
                  fontWeight="bold"
                  textDecoration="none"
                  _hover={{ textDecoration: 'none' }}
                >
                  <IconButton
                    aria-label="投資"
                    size="md"
                    icon={<FaMoneyCheckAlt />}
                    ml={2}
                    isRound
                    colorScheme="yellow"
                  />
                </Link>
              ) : (
                ''
              )}
              <IconButton
                aria-label="いいね！"
                size="md"
                icon={<FaHeart />}
                onClick={handleLike}
                ml={2}
                mr={1}
                isRound
                colorScheme="red"
              />
              {supportNum}
            </Heading>
          </Flex>
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
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
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
            <ReplyMessage
              message={reply.message}
              key={`ChatMessage_${index}`}
            />
          ))}
        </Flex>
        <Spacer height={2} aria-hidden />
      </Container>
    </AuthGuard>
  )
}

export default IdeaDetail
