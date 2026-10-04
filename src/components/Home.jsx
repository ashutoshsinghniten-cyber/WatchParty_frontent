import { useState } from 'react';

export default function Home({ enter }) {
  const urlCode = (new URLSearchParams(window.location.search).get('room') || '').toUpperCase();
  const invited = Boolean(urlCode);
  const [username, setUsername] = useState('');
  const [code, setCode] = useState(urlCode);
  const [error, setError] = useState('');

  const guard = () => { if (!username.trim()) { setError('Enter a display name first.'); return false; } setError(''); return true; };
  const create = async () => { if (guard()) { const r = await enter('create_room', { username }); if (!r.ok) setError(r.error); } };
  const join = async () => {
    if (!guard()) return;
    if (!code.trim()) return setError('Enter a room code.');
    const r = await enter('join_room', { roomId: code.trim(), username });
    if (!r.ok) setError(r.error);
  };

  const joinBtn = <button className={invited ? 'primary' : ''} onClick={join}>Join room {invited ? code : ''}</button>;
  const createBtn = <button className={invited ? '' : 'primary'} onClick={create}>{invited ? 'Create a new room instead' : 'Create a room'}</button>;

  return (
    <main className="home">
      <h1>Watch together,<br />in sync.</h1>
      <p className="sub">
        {invited ? `You have been invited to room ${urlCode}. Enter your name and join.` : 'Start a room, share the code, and everyone sees the same YouTube video at the same second.'}
      </p>
      <div className="panel">
        <label>Your name<input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. Ashutosh" maxLength={24} /></label>
        {invited ? joinBtn : createBtn}
        <div className="divider">{invited ? 'or' : 'or join one'}</div>
        {!invited && <label>Room code<input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="ABC123" maxLength={6} /></label>}
        {invited ? createBtn : joinBtn}
        {error && <p className="error">{error}</p>}
      </div>
    </main>
  );
}