import { ChakraProvider } from '@chakra-ui/react'
import { Header } from '@src/components/header'
import { initializeFirebaseApp } from '@src/configs/initFirebase'
import { AuthProvider } from '@src/lib/auth/authProvider'
import { getApp } from 'firebase/app'
import type { AppProps } from 'next/app'

initializeFirebaseApp()
function App({ Component, pageProps }: AppProps) {
  console.log(getApp())
  return (
    <ChakraProvider>
      <AuthProvider>
        <Header />
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
