import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client';

const RESOLUTION_OPTIONS = [
  { value: 'resolved', label: 'Resolve' },
  { value: 'dismissed', label: 'Dismiss' }
];

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await api.get('/admin/reports');
      setReports(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(report, status) {
    setBusyId(report.id);
    setActionError('');

    try {
      await api.patch(`/admin/reports/${report.id}`, { status });
      await load();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return <p className="admin-state">Loading reports…</p>;
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
      <h1 className="admin-page-title">Resource reports</h1>

      {actionError && (
        <div className="admin-alert" role="alert">
          {actionError}
        </div>
      )}

      {reports.length === 0 ? (
        <p className="admin-state">No reports to review.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Resource</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Reported</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.resource_title || report.resource_id}</td>
                <td>{report.reason}</td>
                <td>
                  <span className={`badge badge-${report.status}`}>
                    {report.status}
                  </span>
                </td>
                <td>{formatDate(report.created_at)}</td>
                <td>
                  <div className="admin-actions">
                    {RESOLUTION_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        className={`admin-button small${option.value === 'dismissed' ? ' danger' : ''}`}
                        type="button"
                        disabled={busyId === report.id || report.status === option.value}
                        onClick={() => updateStatus(report, option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
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
