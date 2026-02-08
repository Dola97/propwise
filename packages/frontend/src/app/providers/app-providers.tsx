'use client'

import { QueryProvider } from './query-provider'
import { InternalModeProvider } from './internal-mode'
import { SocketProvider } from './socket-provider'
import { ToastProvider } from './toast-provider'
import { InternalModeSync } from './internal-mode-sync'


export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <InternalModeProvider>
        <SocketProvider>
          <InternalModeSync />
          {children}
          <ToastProvider />
        </SocketProvider>
      </InternalModeProvider>
    </QueryProvider>
  )
}