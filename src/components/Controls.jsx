import { useState } from 'react';
import { fmt, parseVideoId } from '../utils/youtube';

/**
 * Same UI for everyone. Host/Moderator -> actions run immediately.
 * Participant -> actions become *requests* the host/mod must approve.
 */
export default function Controls({ canControl, playState, time, duration, emit }) {
  const [url, setUrl] = useState('');
  const [seeking, setSeeking] = useState(null);

  const act = (action, payload = {}) => (canControl ? emit(action, payload) : emit('request_action', { action, payload }));
  const commitSeek = () => { if (seeking !== null) act('seek', { time: seeking }); setSeeking(null); };
  const submitUrl = (e) => {
    e.preventDefault();
    const videoId = parseVideoId(url);
    if (!videoId) return alert('That does not look like a YouTube link.');
    act('change_video', { videoId }); setUrl('');
  };

  return (
    <div className="controls">
      <div className="row">
        <button className="primary" onClick={() => act(playState === 'playing' ? 'pause' : 'play')}>
          {playState === 'playing' ? 'Pause' : 'Play'}
        </button>
        <span className="time">{fmt(seeking ?? time)}</span>
        <input type="range" min="0" max={duration || 1} step="1" value={seeking ?? time}
          onChange={(e) => setSeeking(Number(e.target.value))} onMouseUp={commitSeek} onTouchEnd={commitSeek} onKeyUp={commitSeek} />
        <span className="time">{fmt(duration)}</span>
      </div>
      <form className="row" onSubmit={submitUrl}>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste a YouTube link to change the video" />
        <button>{canControl ? 'Change video' : 'Request change'}</button>
      </form>
      {!canControl && <p className="hint">Your actions are sent to the host or moderators for approval.</p>}
    </div>
  );
}
