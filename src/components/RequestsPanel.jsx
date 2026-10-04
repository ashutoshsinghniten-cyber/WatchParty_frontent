const label = (r) => (r.action === 'change_video' ? `change the video` : r.action === 'seek' ? `seek to ${Math.floor(r.payload?.time || 0)}s` : r.action);

export default function RequestsPanel({ requests, emit }) {
  if (!requests.length) return null;
  return (
    <section className="card">
      <h3>Pending requests</h3>
      <ul className="people">
        {requests.map((r) => (
          <li key={r.id}>
            <div><strong>{r.username}</strong> wants to {label(r)}</div>
            <div className="actions">
              <button className="primary" onClick={() => emit('resolve_request', { requestId: r.id, approve: true })}>Approve</button>
              <button onClick={() => emit('resolve_request', { requestId: r.id, approve: false })}>Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
