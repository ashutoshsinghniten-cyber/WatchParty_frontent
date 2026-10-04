import { useEffect, useState, useCallback } from 'react';
import { socket } from '../socket';

/** Holds all room state and wires socket events -> React state. */
export function useRoom() {
  const [session, setSession] = useState(null); // { roomId, me }
  const [participants, setParticipants] = useState([]);
  const [playback, setPlayback] = useState({ videoId: '', playState: 'paused', currentTime: 0, receivedAt: 0 });
  const [messages, setMessages] = useState([]);
  const [requests, setRequests] = useState([]);
  const [toast, setToast] = useState('');
  const [reaction, setReaction] = useState(null);

  const notify = (m) => { setToast(m); setTimeout(() => setToast(''), 3500); };

  useEffect(() => {
    const on = (e, fn) => socket.on(e, fn);
    on('sync_state', (s) => setPlayback({ ...s, receivedAt: Date.now() }));
    on('user_joined', (d) => { setParticipants(d.participants); setMessages((m) => [...m, { system: true, text: `${d.username} joined` }]); });
    on('user_left', (d) => { setParticipants(d.participants); setMessages((m) => [...m, { system: true, text: `${d.username} left` }]); });
    on('participant_removed', (d) => setParticipants(d.participants));
    on('role_assigned', (d) => {
      setParticipants(d.participants);
      setSession((s) => (s && d.userId === socket.id ? { ...s, me: { ...s.me, role: d.role } } : s));
      setMessages((m) => [...m, { system: true, text: `${d.username} is now ${d.role}` }]);
    });
    on('requests_updated', (d) => setRequests(d.requests));
    on('chat_message', (m) => setMessages((l) => [...l, m]));
    on('reaction', (r) => { setReaction({ ...r, k: Date.now() }); setTimeout(() => setReaction(null), 2000); });
    on('error_message', (d) => notify(d.message));
    on('info_message', (d) => notify(d.message));
    on('removed', (d) => { setSession(null); setRequests([]); setMessages([]); notify(d.message); });
    return () => socket.removeAllListeners();
  }, []);

  const enter = useCallback((event, payload) => new Promise((resolve) => {
    socket.emit(event, payload, (res) => {
      if (res?.ok) { setSession({ roomId: res.roomId, me: res.me }); setParticipants(res.participants); setMessages([]); setRequests([]); }
      resolve(res);
    });
  }), []);

  const leave = () => { socket.emit('leave_room'); setSession(null); setRequests([]); };
  const emit = (e, p) => socket.emit(e, p);

  return { session, participants, playback, messages, requests, toast, reaction, enter, leave, emit };
}
