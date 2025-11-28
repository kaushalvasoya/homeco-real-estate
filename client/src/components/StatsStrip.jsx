// client/src/components/StatsStrip.jsx
import React from 'react';

export default function StatsStrip({ stats }) {
  return (
    <div className="container-lg">
      <div className="stats-strip">
        {stats.map((s,i) => (
          <div key={i}>
            <div className="stat-num">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
