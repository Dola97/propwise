'use client'

import { useSyncInternalMode } from '@/app/hooks/use-sync-internal-mode'

/**
 * Headless component that syncs InternalMode context → axios interceptor.
 * Must be rendered inside InternalModeProvider.
 */
export function InternalModeSync() {
    useSyncInternalMode();
    return null;
}