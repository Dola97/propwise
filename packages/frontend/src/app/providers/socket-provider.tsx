'use client'

import { createContext, useEffect, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { getSocket } from '@/app/lib/socket'

export const SocketContext = createContext<Socket | null>(null)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  // Lazy init — getSocket() runs only once, returns singleton
  const [socket] = useState<Socket | null>(() => {
    if (typeof window === 'undefined') return null
    return getSocket()
  })

  useEffect(() => {
    if (!socket) return

    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [socket])

  return (
    <SocketContext value={socket}>
      {children}
    </SocketContext>
  )
}