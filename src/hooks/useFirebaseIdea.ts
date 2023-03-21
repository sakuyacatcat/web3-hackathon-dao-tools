import initializeFirebaseClient from '@src/configs/initFirebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export interface Idea {
  id: string
  headline: string // 見出し
  summary: string // 概要
  issue: string // 課題
  solution: string // 解決策
  creatorVoice: string // 発案者の声
  howToStart: string // 始め方
  customerVoice: string // 顧客の声
  userUid: string // 作成者
  timestamp: string // 作成日時
  deadline: Date | null // 締切日
  replies: [
    {
      // 返信
      userUid: string
      message: string
      timestamp: Date
    }
  ]
  supports: [
    {
      // 支援者
      userUid: string
      timestamp: Date
    }
  ]
  votes: [
    {
      // 投票
      userUid: string
      vote: boolean
      timestamp: Date
    }
  ]
}

export default function useFirebaseIdea() {
  const { auth, db } = initializeFirebaseClient()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [idea, setIdea] = useState<Idea | null>(null)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id) {
      const listener = onSnapshot(doc(db, 'ideas', id), (doc) => {
        if (doc.exists()) {
          setIdea({ ...(doc.data() as Idea) })
        } else {
          setIdea(null)
        }
        setIsLoading(false)
      })
      return () => {
        listener()
      }
    }
  }, [id])

  return { isLoading, idea }
}
