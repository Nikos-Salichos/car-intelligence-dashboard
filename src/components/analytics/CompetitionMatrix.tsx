import React from 'react';
import { CompetitionAnalysisDto } from '../../types';

interface Props {
  data: CompetitionAnalysisDto[];
}

export const CompetitionMatrix: React.FC<Props> = ({ data }) => {
  return (
    <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h3>Arbitrage Matrix (Private vs Dealers)</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', fontSize: '0.9rem', color: '#666' }}>
              <th>Vehicle Model</th>
              <th>Private Units (Avg Price)</th>
              <th>Dealer Units (Avg Price)</th>
              <th>Potential Trade-in Margin</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 5).map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f2f2f2' }}>
                <td style={{ padding: '0.5rem 0' }}><strong>{item.brand} {item.model}</strong></td>
                <td>{item.privateListingsCount} units (€{item.privateAvgPrice?.toLocaleString() || 0})</td>
                <td>{item.dealerListingsCount} units (€{item.dealerAvgPrice?.toLocaleString() || 0})</td>
                <td style={{ color: '#00796b', fontWeight: 'bold' }}>+€{item.potentialDealerMargin.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};