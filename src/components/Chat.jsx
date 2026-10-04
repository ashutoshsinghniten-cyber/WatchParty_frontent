import { useEffect, useRef, useState } from 'react';

const EMOJIS = ['😂', '🔥', '❤️', '👏', '😮'];

export default function Chat({ messages, emit }) {
  const [text, setText] = useState('');
  const end = useRef(null);
useEffect(() => {
  end.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);
  const send = (e) => { e.preventDefault(); if (text.trim()) { emit('chat_message', { text }); setText(''); } };

  return (
    <section className="card chat">
      <h3>Chat</h3>
      <div className="msgs">
        {messages.map((m, i) => (m.system
          ? <p key={i} className="sys">{m.text}</p>
          : <p key={i}><strong>{m.username}:</strong> {m.text}</p>))}
        <div ref={end} />
      </div>
      <div className="emojis">{EMOJIS.map((e) => <button key={e} onClick={() => emit('reaction', { emoji: e })}>{e}</button>)}</div>
      <form className="row" onSubmit={send}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Say something…" maxLength={300} />
        <button>Send</button>
      </form>
    </section>
  );
}
