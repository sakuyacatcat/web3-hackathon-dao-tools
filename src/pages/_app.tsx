import { ChakraProvider } from '@chakra-ui/react'
import { Header } from '@src/components/Header'
import { AuthProvider } from '@src/contexts/AuthProvider'
import type { AppProps } from 'next/app'

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
