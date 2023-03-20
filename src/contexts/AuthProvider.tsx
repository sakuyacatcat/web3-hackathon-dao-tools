import useFirebaseUser, { UserWithRole } from '@src/hooks/useFirebaseUser'
import {
  createContext,
  ReactNode,
  useContext
} from 'react'

export type GlobalAuthState = {
  user: UserWithRole | null | undefined
}

const initialState: GlobalAuthState = {
  user: undefined,
}

const AuthContext = createContext<GlobalAuthState>(initialState)

type Props = { children: ReactNode }

export const AuthProvider = ({ children }: Props) => {
  const { user, isLoading } = useFirebaseUser();

  const value: GlobalAuthState = {
    user: user ?? initialState.user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)
