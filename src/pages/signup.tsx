import {
  Box,
  Button,
  Center,
  chakra,
  Container,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Link,
  Select,
  Spacer,
  useToast,
} from '@chakra-ui/react'
import { doc, getFirestore, setDoc } from '@firebase/firestore'
import { FirebaseError } from '@firebase/util'
import { createWeb3Account } from '@src/lib/createWeb3Account'
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from 'firebase/auth'
import { FormEvent, useState } from 'react'

export const SignUp = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [role, setRole] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const toast = useToast()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    e.preventDefault()

    try {
      const db = getFirestore()
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const account = createWeb3Account()

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        role: role,
        address: account.address,
        privateKey: account.privateKey,
      })

      await sendEmailVerification(userCredential.user)
      setEmail('')
      setPassword('')
      setRole('')

      toast({
        title: '確認メールを送信しました。',
        status: 'success',
        position: 'top',
      })
    } catch (e) {
      toast({
        title: 'エラーが発生しました。',
        status: 'error',
        position: 'top',
      })

      if (e instanceof FirebaseError) {
        console.log(e)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container py={14}>
      <Heading>サインアップ</Heading>
      <chakra.form onSubmit={handleSubmit}>
        <Spacer height={8} aria-hidden />
        <Grid gap={4}>
          <Box display={'contents'}>
            <FormControl>
              <FormLabel>メールアドレス</FormLabel>
              <Input
                type={'email'}
                name={'email'}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>パスワード</FormLabel>
              <Input
                type={'password'}
                name={'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
              />
            </FormControl>
            <FormControl isRequired aria-required>
              <FormLabel>ロール</FormLabel>
              <Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value=""></option>
                <option value="engineer">技術職</option>
                <option value="business">事務職</option>
                <option value="administrator">BE creation</option>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Spacer height={4} aria-hidden />
        <Center>
          <Button type={'submit'} isLoading={isLoading}>
            アカウントを作成
          </Button>
        </Center>
        <Center>
          <Button variant="link" mt={8}>
            <Link href="/signin">ログイン画面へ</Link>
          </Button>
        </Center>
      </chakra.form>
    </Container>
  )
}

export default SignUp
