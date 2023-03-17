import { ChakraProvider } from '@chakra-ui/react'
import { Header } from '@src/components/Header'
import { initializeFirebaseApp } from '@src/configs/initFirebase'
import { AuthProvider } from '@src/lib/auth/AuthProvider'
import type { AppProps } from 'next/app'

initializeFirebaseApp()
function App({ Component, pageProps }: AppProps) {
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
