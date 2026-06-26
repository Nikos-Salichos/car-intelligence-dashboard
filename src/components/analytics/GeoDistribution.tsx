import React from 'react';
import { GeographicDistributionDto } from '../../types';

interface Props {
  data: GeographicDistributionDto[];
}

export const GeoDistribution: React.FC<Props> = ({ data }) => {
  return (
    <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h3>Geographic Dispersion Framework</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
        {data.map((item, idx) => (
          <div key={idx} style={{ padding: '1rem', backgroundColor: '#f5f5f7', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ color: '#666', fontSize: '0.85rem', fontWeight: 'bold' }}>{item.region}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0.25rem 0', color: '#111' }}>{item.totalListings}</div>
            <div style={{ fontSize: '0.8rem', color: '#0070f3' }}>Avg: €{item.averagePrice.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};