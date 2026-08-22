import React from 'react';
import Badge from '../common/Badge';

const ModerationStatus = ({
  status = 'Approved', // 'Approved' | 'Pending' | 'Rejected' | 'Flagged'
  className = ''
}) => {
  const configs = {
    Approved: { variant: 'success', label: 'Verified Review', dot: true },
    Pending: { variant: 'warning', label: 'Under Moderation', dot: true },
    Rejected: { variant: 'danger', label: 'Rejected', dot: true },
    Flagged: { variant: 'danger', label: 'Flagged by Community', dot: true }
  };

  const current = configs[status] || configs.Approved;

  return (
    <Badge
      variant={current.variant}
      size="sm"
      dot={current.dot}
      className={className}
    >
      {current.label}
    </Badge>
  );
};

export default ModerationStatus;
