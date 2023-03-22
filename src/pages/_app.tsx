import { ChakraProvider } from '@chakra-ui/react'
import { Header } from '@src/components/Header'
import type { AppProps } from 'next/app'

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Header />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default App
