import { Button, Container, Text, VStack } from '@chakra-ui/react'
import { useAuthContext } from '@src/contexts/AuthProvider'
import { remainingDate } from '@src/lib/date'
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const VotePage = () => {
  const { user } = useAuthContext()
  const router = useRouter()
  const { id } = router.query
  const [idea, setIdea] = useState(null)
  const [vote, setVote] = useState(null)
  const [deadline, setDeadline] = useState<Date>(new Date())
  const [remaining, setRemaining] = useState<String>('00:00:00')
  const db = getFirestore()

  // デッドラインを1週間後に設定する
  const startVoting = async () => {
    const date = new Date()
    date.setDate(date.getDate() + 7)
    try {
      await updateDoc(doc(db, 'ideas', id), {
        deadline: date,
      })
    } catch (e) {
      console.log(e)
    }
    setRemaining(date)
  }

  // 投票処理
  const voteYes = () => {
    setVote('yes')
  }
  const voteNo = () => {
    setVote('no')
  }

  // 残り時間の計算
  useEffect(() => {
    const fetchIdea = async () => {
      const ideaRef = doc(db, 'ideas', id)
      const ideaSnapshot = await getDoc(ideaRef)

      if (ideaSnapshot.exists()) {
        setIdea(ideaSnapshot.data())
        setDeadline(ideaSnapshot.data().deadline)
      }
    }

    if (id) {
      fetchIdea()
    }

    console.log(deadline)
    console.log(idea)

    const timer = setInterval(() => {
      const remainingDateStr = remainingDate(deadline)
      if (remainingDateStr === '00:00:00') {
        clearInterval(timer)
        setRemaining('投票は締め切られました。')
      } else {
        setRemaining(remainingDateStr)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [deadline])

  return (
    <Container maxW="xl" py={12}>
      {!vote && (
        <VStack mt={20}>
          <Button size="lg" colorScheme="blue" onClick={startVoting}>
            投資を開始する
          </Button>
        </VStack>
      )}
      {vote && (
        <VStack mt={20}>
          <Text fontSize="lg">投票ありがとうございました！</Text>
        </VStack>
      )}
      {deadline.getTime() > new Date().getTime() && vote === null && (
        <VStack mt={20}>
          <Text fontSize="lg" fontWeight="bold">
            残り時間: {remaining}
          </Text>
          <Button size="lg" colorScheme="green" onClick={voteYes}>
            Yes
          </Button>
          <Button size="lg" colorScheme="red" onClick={voteNo}>
            No
          </Button>
        </VStack>
      )}
      {deadline.getTime() <= new Date().getTime() && (
        <VStack mt={20}>
          <Text fontSize="lg">投票は締め切られました。</Text>
        </VStack>
      )}
    </Container>
  )
}

export default VotePage
