import {
  Box,
  Button,
  chakra,
  Container,
  Stack,
  useToast,
} from '@chakra-ui/react'
import { doc, serverTimestamp, updateDoc } from '@firebase/firestore'
import { FirebaseError } from '@firebase/util'
import { AuthGuard } from '@src/components/AuthGuard'
import initializeFirebaseClient from '@src/configs/initFirebase'
import useFirebaseIdea from '@src/hooks/useFirebaseIdea'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'
import { IdeaInput, RequiredIdeaInput } from '../new'

export const EditIdea = () => {
  const { db } = initializeFirebaseClient()
  const { idea } = useFirebaseIdea()
  const [headline, setHeadline] = useState<string>('')
  const [summary, setSummary] = useState<string>('')
  const [issue, setIssue] = useState<string>('')
  const [solution, setSolution] = useState<string>('')
  const [creatorVoice, setCreatorVoice] = useState<string>('')
  const [howToStart, setHowToStart] = useState<string>('')
  const [customerVoice, setCustomerVoice] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const toast = useToast()
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (idea !== null) {
      setHeadline(idea.headline)
      setSummary(idea.summary)
      setIssue(idea.issue)
      setSolution(idea.solution)
      setCreatorVoice(idea.creatorVoice)
      setHowToStart(idea.howToStart)
      setCustomerVoice(idea.customerVoice)
    }
  }, [idea])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    e.preventDefault()

    try {
      await updateDoc(doc(db, 'ideas', id), {
        headline: headline,
        summary: summary,
        issue: issue,
        solution: solution,
        creatorVoice: creatorVoice,
        howToStart: howToStart,
        customerVoice: customerVoice,
        timestamp: serverTimestamp(),
      })
      setHeadline('')
      setSummary('')
      setIssue('')
      setSolution('')
      setCreatorVoice('')
      setHowToStart('')
      setCustomerVoice('')

      router.push('/ideas/' + id)

      toast({
        title: 'アイデア更新しました',
        status: 'success',
        position: 'top',
      })
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
              <RequiredIdeaInput
                message={headline}
                setFunc={setHeadline}
                placeholder="見出し"
              />
              <RequiredIdeaInput
                message={summary}
                setFunc={setSummary}
                placeholder="概要"
              />
              <IdeaInput
                message={issue}
                setFunc={setIssue}
                placeholder="課題"
              />
              <IdeaInput
                message={solution}
                setFunc={setSolution}
                placeholder="解決策"
              />
              <IdeaInput
                message={creatorVoice}
                setFunc={setCreatorVoice}
                placeholder="発案者の声"
              />
              <IdeaInput
                message={howToStart}
                setFunc={setHowToStart}
                placeholder="始め方"
              />
              <IdeaInput
                message={customerVoice}
                setFunc={setCustomerVoice}
                placeholder="顧客の声"
              />
              <Button
                colorScheme="teal"
                size="lg"
                type="submit"
                isLoading={isLoading}
              >
                更新
              </Button>
            </Stack>
          </chakra.form>
        </Box>
      </Container>
    </AuthGuard>
  )
}

export default EditIdea
