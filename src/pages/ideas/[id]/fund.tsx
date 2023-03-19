import { Button, Container, Text, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

const VotePage = () => {
  const [deadline, setDeadline] = useState(new Date())
  const [vote, setVote] = useState(null)
  const [remaining, setRemaining] = useState('00:00:00')

  // デッドラインを1週間後に設定する
  const startVoting = () => {
    const date = new Date()
    date.setDate(date.getDate() + 7)
    setDeadline(date)
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
    const timer = setInterval(() => {
      const diff = deadline.getTime() - new Date().getTime()
      if (diff <= 0) {
        clearInterval(timer)
        setRemaining('投票は締め切られました。')
      } else {
        const hours = Math.floor(diff / 1000 / 60 / 60)
        const minutes = Math.floor((diff / 1000 / 60) % 60)
        const seconds = Math.floor((diff / 1000) % 60)
        setRemaining(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        )
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
