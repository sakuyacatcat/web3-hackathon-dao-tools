import { ChakraProvider } from '@chakra-ui/react'
import { initializeFirebaseApp } from '@src/configs/initFirebase'
import { getApp } from 'firebase/app'
import type { AppProps } from 'next/app'

initializeFirebaseApp()
function App({ Component, pageProps }: AppProps) {
  console.log(getApp())
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default App
