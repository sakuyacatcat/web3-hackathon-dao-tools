import { Button, Container, Text, VStack } from '@chakra-ui/react'
import { AuthGuardAdmin } from '@src/components/AuthGuardAdmin'
import initializeFirebaseClient from '@src/configs/initFirebase'
import useFirebaseIdea from '@src/hooks/useFirebaseIdea'
import useFirebaseUser from '@src/hooks/useFirebaseUser'
import investByVote from '@src/lib/contracts/invextByVote'
import { remainingDate } from '@src/lib/date'
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const VotePage = () => {
  const { db } = initializeFirebaseClient()
  const { idea } = useFirebaseIdea()
  const { user } = useFirebaseUser()
  const [voted, setVoted] = useState<boolean>(false)
  const [deadlineUnixTime, setDeadlineUnixTime] = useState<number>(0)
  const [remaining, setRemaining] = useState<String>('')
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (idea) {
      setVoted(idea.votes.some((vote) => vote.userUid === user?.uid))
      setDeadlineUnixTime(idea.deadlineUnixTime)
      if (deadlineUnixTime !== 0) {
        const timer = setInterval(() => {
          setRemaining(remainingDate(deadlineUnixTime))
        }, 1000)
        return () => clearInterval(timer)
      }
    }
  }, [idea, deadlineUnixTime, remaining])

  const handleStartVoting = async () => {
    const now = new Date()
    const target = now.getTime() + 7 * 24 * 60 * 60 * 1000
    try {
      await updateDoc(doc(db, 'ideas', id), {
        deadlineUnixTime: target,
      })
      setDeadlineUnixTime(target)
    } catch (e) {
      console.log(e)
    }
  }

  const handleVote = async (yesOrNo: string) => {
    const vote = yesOrNo === 'Yes' ? true : false

    if (vote === true) {
      const authorRef = doc(db, "users", idea?.userUid)
      const author = await getDoc(authorRef)
      investByVote(author.data().address, 1)
    }

    try {
      await updateDoc(doc(db, 'ideas', id), {
        votes: arrayUnion({
          userUid: user?.uid,
          vote: vote,
          timestamp: new Date(),
        }),
      })
    } catch (e) {
      console.log(e)
    }
    setVoted(true)
  }

  return (
    <AuthGuardAdmin>
      <Container maxW="xl" py={12}>
        <VStack mt={20}>
          {deadlineUnixTime === 0 ? (
            <Button
              size="lg"
              colorScheme="blue"
              onClick={() => handleStartVoting()}
            >
              投資を開始する
            </Button>
          ) : voted === true ? (
            <Text fontSize="lg">投票ありがとうございました！</Text>
          ) : remaining === '00:00:00' ? (
            <Text fontSize="lg">投票は締め切られました。</Text>
          ) : (
            <VStack mt={20}>
              <Text fontSize="lg" fontWeight="bold">
                残り時間: {remaining}
              </Text>
              <Button
                size="lg"
                colorScheme="green"
                onClick={() => handleVote('Yes')}
              >
                Yes
              </Button>
              <Button
                size="lg"
                colorScheme="red"
                onClick={() => handleVote('No')}
              >
                No
              </Button>
            </VStack>
          )}
        </VStack>
      </Container>
    </AuthGuardAdmin>
  )
}

export default VotePage
