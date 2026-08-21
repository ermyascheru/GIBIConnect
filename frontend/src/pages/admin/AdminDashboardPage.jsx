import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SECTIONS = [
  {
    to: '/admin/verifications',
    title: 'Institution Verifications',
    description:
      'Review submitted institutions and approve or reject their verification requests.'
  },
  {
    to: '/admin/reports',
    title: 'Resource Reports',
    description:
      'Handle reports filed against resources and resolve or dismiss them.'
  },
  {
    to: '/admin/audit-logs',
    title: 'Audit Logs',
    description:
      'Trace every administrative action taken across the platform.'
  }
];

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <section>
      <h1 className="admin-page-title">Admin console</h1>
      <p className="admin-page-subtitle">
        Welcome{user?.name ? `, ${user.name}` : ''}. Moderate verifications,
        reports and audit trails for GIBIConnect.
      </p>

      <div className="admin-cards">
        {SECTIONS.map((section) => (
          <Link key={section.to} to={section.to} className="admin-card">
            <h2>{section.title}</h2>
            <p>{section.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
