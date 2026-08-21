import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await api.get('/admin/verifications');
      setVerifications(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function decide(verification, decision) {
    setBusyId(verification.id);
    setActionError('');

    try {
      await api.post(`/admin/verifications/${verification.id}`, { decision });
      await load();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return <p className="admin-state">Loading verifications…</p>;
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
      <h1 className="admin-page-title">Institution verifications</h1>

      {actionError && (
        <div className="admin-alert" role="alert">
          {actionError}
        </div>
      )}

      {verifications.length === 0 ? (
        <p className="admin-state">No verification requests to review.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Institution</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {verifications.map((verification) => (
              <tr key={verification.id}>
                <td>{verification.institution_name || verification.institution_id}</td>
                <td>
                  <span className={`badge badge-${verification.status}`}>
                    {verification.status}
                  </span>
                </td>
                <td>{formatDate(verification.submitted_at || verification.created_at)}</td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="admin-button small"
                      type="button"
                      disabled={busyId === verification.id}
                      onClick={() => decide(verification, 'verified')}
                    >
                      Approve
                    </button>
                    <button
                      className="admin-button small danger"
                      type="button"
                      disabled={busyId === verification.id}
                      onClick={() => decide(verification, 'rejected')}
                    >
                      Reject
                    </button>
                  </div>
                </td>
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
