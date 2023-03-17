import {
  Box,
  Button,
  Container,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react'
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from '@firebase/firestore'
import { FirebaseError } from '@firebase/util'
import { AuthGuard } from '@src/components/AuthGuard'
import { useAuthContext } from '@src/lib/auth/AuthProvider'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'

export const NewIdea = () => {
  const { user } = useAuthContext()
  const [headline, setHeadline] = useState('')
  const [summary, setSummary] = useState('')
  const [issue, setIssue] = useState('')
  const [solution, setSolution] = useState('')
  const [creatorVoice, setCreatorVoice] = useState('')
  const [howToStart, setHowToStart] = useState('')
  const [customerVoice, setCustomerVoice] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const { push } = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    e.preventDefault()
    try {
      const db = getFirestore()
      await addDoc(collection(db, 'ideas'), {
        headline,
        summary,
        issue,
        solution,
        creatorVoice,
        howToStart,
        customerVoice,
        author: user?.email,
        timestamp: serverTimestamp(),
      })
      setHeadline('')
      setSummary('')
      setIssue('')
      setSolution('')
      setCreatorVoice('')
      setHowToStart('')
      setCustomerVoice('')
      toast({
        title: 'アイデア投稿しました',
        status: 'success',
        position: 'top',
      })
      push('/')
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthGuard>
      <Container maxW="xl" py={12}>
        <Box boxShadow="lg" p={6} rounded="lg">
          <form onSubmit={handleSubmit}>
            <Stack direction={{ base: 'column', md: 'column' }} spacing={4}>
              <Input
                placeholder="見出し(必須)"
                size="lg"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                required
                aria-required
              />
              <Input
                placeholder="概要(必須)"
                size="lg"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
                aria-required
              />
              <Input
                placeholder="課題"
                size="lg"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
              />
              <Input
                placeholder="解決策"
                size="lg"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
              />
              <Input
                placeholder="発案者の声"
                size="lg"
                value={creatorVoice}
                onChange={(e) => setCreatorVoice(e.target.value)}
              />
              <Input
                placeholder="始め方"
                size="lg"
                value={howToStart}
                onChange={(e) => setHowToStart(e.target.value)}
              />
              <Input
                placeholder="顧客の声"
                size="lg"
                value={customerVoice}
                onChange={(e) => setCustomerVoice(e.target.value)}
              />
              <Button
                colorScheme="teal"
                size="lg"
                type="submit"
                isLoading={isLoading}
              >
                投稿
              </Button>
            </Stack>
          </form>
        </Box>
      </Container>
    </AuthGuard>
  )
}

export default NewIdea
