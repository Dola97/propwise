"use client";

import { use } from "react";
import { SocketContext } from "@/app/providers/socket-provider";
import type { Socket } from "socket.io-client";

export function useSocket(): Socket | null {
    return use(SocketContext);
}
