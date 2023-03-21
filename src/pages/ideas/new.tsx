import {
  Box,
  Button,
  chakra,
  Container,
  Input,
  Stack,
  useToast
} from '@chakra-ui/react'
import {
  addDoc,
  collection, serverTimestamp
} from '@firebase/firestore'
import { FirebaseError } from '@firebase/util'
import { AuthGuard } from '@src/components/AuthGuard'
import initializeFirebaseClient from '@src/configs/initFirebase'
import useFirebaseUser from '@src/hooks/useFirebaseUser'
import { useRouter } from 'next/router'
import { Dispatch, FormEvent, SetStateAction, useState } from 'react'

type IdeaInputProps = {
  message: string
  setFunc: Dispatch<SetStateAction<string>>
  placeholder: string
}

const IdeaInput = ({ message, setFunc, placeholder }: IdeaInputProps) => {
  return (
    <Input
      placeholder={placeholder}
      size="lg"
      value={message}
      onChange={(e) => setFunc(e.target.value)}
    />
  )
}

const RequiredIdeaInput = ({ message, setFunc, placeholder }: IdeaInputProps) => {
  const requiredPlaceholder = placeholder + "(必須)"

  return (
    <Input
      placeholder={requiredPlaceholder}
      size="lg"
      value={message}
      onChange={(e) => setFunc(e.target.value)}
      required
      aria-required
    />
  )
}

export const NewIdea = () => {
  const { db } = initializeFirebaseClient()
  const { user } = useFirebaseUser()
  const [headline, setHeadline] = useState('')
  const [summary, setSummary] = useState('')
  const [issue, setIssue] = useState('')
  const [solution, setSolution] = useState('')
  const [creatorVoice, setCreatorVoice] = useState('')
  const [howToStart, setHowToStart] = useState('')
  const [customerVoice, setCustomerVoice] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    e.preventDefault()
    try {
      await addDoc(collection(db, 'ideas'), {
        headline,
        summary,
        issue,
        solution,
        creatorVoice,
        howToStart,
        customerVoice,
        userUid: user?.uid,
        timestamp: serverTimestamp(),
        deadline: null,
        replies: [],
        supports: [],
        votes: [],
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
      router.push('/')
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
          <chakra.form onSubmit={handleSubmit}>
            <Stack direction={{ base: 'column', md: 'column' }} spacing={4}>
              <RequiredIdeaInput message={headline} setFunc={setHeadline} placeholder="見出し" />
              <RequiredIdeaInput message={summary} setFunc={setSummary} placeholder="概要" />
              <IdeaInput message={issue} setFunc={setIssue} placeholder="課題" />
              <IdeaInput message={solution} setFunc={setSolution} placeholder="解決策" />
              <IdeaInput message={creatorVoice} setFunc={setCreatorVoice} placeholder="発案者の声" />
              <IdeaInput message={howToStart} setFunc={setHowToStart} placeholder="始め方" />
              <IdeaInput message={customerVoice} setFunc={setCustomerVoice} placeholder="顧客の声" />
              <Button
                colorScheme="teal"
                size="lg"
                type="submit"
                isLoading={isLoading}
              >
                投稿
              </Button>
            </Stack>
          </chakra.form>
        </Box>
      </Container>
    </AuthGuard>
  )
}

export default NewIdea
