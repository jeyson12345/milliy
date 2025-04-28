import React from 'react';
import '../statistics.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  fullWidth?: boolean;
}

function StatisticsCard({ title, children, fullWidth }: Props) {
  return (
    <div
      className="statistics-card"
      style={{ width: fullWidth ? '100%' : 'calc(50% - 12px)' }}
    >
      <div className="statistics-card-title">
        <h2>{title}</h2>
      </div>
      <div className="statistics-card-content">{children}</div>
    </div>
  );
}

export default StatisticsCard;
