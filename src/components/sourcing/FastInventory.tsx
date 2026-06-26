import React from 'react';
import { FastMovingCarDto } from '../../types';

interface Props {
  data: FastMovingCarDto[];
}

export const FastInventory: React.FC<Props> = ({ data }) => {
  return (
    <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h3>Fast-Moving Cars (High Turnover)</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {data.slice(0, 5).map((item, idx) => (
          <li key={idx} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>{item.brand} {item.model}</strong> ({item.totalSoldUnitsSample} tracking cycles)</span>
            <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>{item.averageDaysToSell} days avg stay</span>
          </li>
        ))}
      </ul>
    </div>
  );
};