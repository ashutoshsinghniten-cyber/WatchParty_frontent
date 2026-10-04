import { useState } from 'react';
import { socket } from '../socket';
import VideoPlayer from './VideoPlayer';
import Controls from './Controls';
import ParticipantList from './ParticipantList';
import RequestsPanel from './RequestsPanel';
import Chat from './Chat';

export default function Room({ session, participants, playback, messages, requests, reaction, leave, emit }) {
  const [tick, setTick] = useState({ time: 0, duration: 0 });
  const me = { ...session.me, userId: socket.id };
  const canControl = me.role === 'host' || me.role === 'moderator';
  const link = `${window.location.origin}/?room=${session.roomId}`;

  return (
    <div className="room">
      <header>
        <div>
          <h2>Room {session.roomId}</h2>
          <span className={`badge ${me.role}`}>{me.role}</span>
        </div>
        <div className="row">
          <button onClick={() => navigator.clipboard.writeText(link)}>Copy invite link</button>
          <button className="danger" onClick={leave}>Leave</button>
        </div>
      </header>
      <div className="layout">
        <div className="main">
          <div className="stage">
            <VideoPlayer playback={playback} onTick={(time, duration) => setTick({ time, duration })} />
            {reaction && <div key={reaction.k} className="float">{reaction.emoji}<small>{reaction.username}</small></div>}
          </div>
          <Controls canControl={canControl} playState={playback.playState} time={tick.time} duration={tick.duration} emit={emit} />
        </div>
        <aside>
          {canControl && <RequestsPanel requests={requests} emit={emit} />}
          <ParticipantList participants={participants} me={me} emit={emit} />
          <Chat messages={messages} emit={emit} />
        </aside>
      </div>
    </div>
  );
}
