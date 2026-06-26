import React from 'react';
import { BulkDepreciationDto } from '../../types';

interface Props {
  data: BulkDepreciationDto[];
}

export const DepreciationCurve: React.FC<Props> = ({ data }) => {
  return (
    <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h3>Bulk Depreciation Factor (Value Loss per 10,000 km)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {data.slice(0, 5).map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f1f1f1' }}>
            <div>
              <strong>{item.brand} {item.model}</strong>
              <div style={{ fontSize: '0.8rem', color: '#777' }}>Dataset pool: {item.samplePoints} points</div>
            </div>
            <div style={{ color: '#c2185b', fontWeight: 'bold' }}>-€{item.priceLossPerTenThousandKm.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};