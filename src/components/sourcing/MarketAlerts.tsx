import React from 'react';
import { MarketAlertDto } from '../../types';

interface Props {
  data: MarketAlertDto[];
}

export const MarketAlerts: React.FC<Props> = ({ data }) => {
  return (
    <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h3>Market Activity Alerts</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {data.slice(0, 4).map((alert, idx) => (
          <div key={idx} style={{ borderLeft: '4px solid #f57c00', backgroundColor: '#fff3e0', padding: '0.75rem', borderRadius: '0 4px 4px 0' }}>
            <div style={{ fontWeight: 'bold', color: '#e65100' }}>{alert.alertCategory} ({alert.brand} {alert.model})</div>
            <div style={{ fontSize: '0.9rem', color: '#555' }}>{alert.generatedMessage}</div>
          </div>
        ))}
      </div>
    </div>
  );
};