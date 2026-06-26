import React from 'react';
import { FuelMarketShareDto } from '../../types';

interface Props {
  data: FuelMarketShareDto[];
}

export const FuelMarketShare: React.FC<Props> = ({ data }) => {
  return (
    <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h3>Market Volume Allocation via Fuel Type</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {data.map((fuel, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
              <span><strong>{fuel.fuelType || 'Unknown'}</strong> ({fuel.totalListings.toLocaleString()} items)</span>
              <span>{fuel.marketSharePercentage}%</span>
            </div>
            <div style={{ width: '100%', backgroundColor: '#eee', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${fuel.marketSharePercentage}%`, backgroundColor: '#0070f3', height: '100%' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};