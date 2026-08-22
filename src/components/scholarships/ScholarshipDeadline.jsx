import React from 'react';
import Badge from '../common/Badge';

const ScholarshipDeadline = ({ deadlineDate }) => {
  if (!deadlineDate) {
    return <Badge variant="default" size="sm">Rolling Basis</Badge>;
  }

  const deadline = new Date(deadlineDate);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let variant = 'success';
  let label = `Closes ${deadlineDate}`;

  if (diffDays < 0) {
    variant = 'danger';
    label = 'Closed';
  } else if (diffDays <= 7) {
    variant = 'warning';
    label = `Closing Soon (${diffDays}d left)`;
  } else {
    variant = 'info';
    label = `${diffDays} days remaining`;
  }

  return (
    <div className="flex items-center gap-1.5">
      <Badge variant={variant} size="sm" dot>
        {label}
      </Badge>
    </div>
  );
};

export default ScholarshipDeadline;
