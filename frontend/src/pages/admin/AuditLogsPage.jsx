import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await api.get('/admin/audit-logs');
      setLogs(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <p className="admin-state">Loading audit logs…</p>;
  }

  if (error) {
    return (
      <div className="admin-error" role="alert">
        <p>{error}</p>
        <button className="admin-button" type="button" onClick={load}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <section>
      <h1 className="admin-page-title">Audit logs</h1>

      {logs.length === 0 ? (
        <p className="admin-state">No audit activity recorded yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Actor</th>
              <th>Entity</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.action}</td>
                <td>{log.actor_name || log.actor_id || '—'}</td>
                <td>{log.entity_type ? `${log.entity_type} ${log.entity_id || ''}` : '—'}</td>
                <td>{formatDate(log.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

function formatDate(value) {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleString();
}
