export default function ParticipantList({ participants, me, emit }) {
  const isHost = me.role === 'host';
  return (
    <section className="card">
      <h3>People ({participants.length})</h3>
      <ul className="people">
        {participants.map((p) => (
          <li key={p.userId}>
            <div><strong>{p.username}</strong>{p.userId === me.userId && ' (you)'} <span className={`badge ${p.role}`}>{p.role}</span></div>
            {isHost && p.userId !== me.userId && (
              <div className="actions">
                <select value={p.role} onChange={(e) => emit('assign_role', { userId: p.userId, role: e.target.value })}>
                  <option value="participant">participant</option>
                  <option value="moderator">moderator</option>
                  <option value="viewer">viewer</option>
                </select>
                <button onClick={() => window.confirm(`Make ${p.username} the host? You become a moderator.`) && emit('transfer_host', { userId: p.userId })}>Make host</button>
                <button className="danger" onClick={() => emit('remove_participant', { userId: p.userId })}>Remove</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
