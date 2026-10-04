import { useRoom } from './hooks/useRoom';
import Home from './components/Home';
import Room from './components/Room';

export default function App() {
  const room = useRoom();
  return (
    <>
      {room.session ? <Room {...room} /> : <Home enter={room.enter} />}
      {room.toast && <div className="toast">{room.toast}</div>}
    </>
  );
}
