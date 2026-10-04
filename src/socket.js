import { io } from 'socket.io-client';

// VITE_SERVER_URL = your deployed backend URL. Empty in local dev (Vite proxies /socket.io to :4000).
export const socket = io(import.meta.env.VITE_SERVER_URL || undefined, {
  transports: ['websocket', 'polling'],
});
