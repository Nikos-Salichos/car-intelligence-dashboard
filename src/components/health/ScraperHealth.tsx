import React from 'react';
import { ScraperHealthDto } from '../../types';

interface Props {
  health: ScraperHealthDto | null;
}

export const ScraperHealth: React.FC<Props> = ({ health }) => {
  if (!health) return null;

  return (
    <div style={{ backgroundColor: '#111', color: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #222' }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#00ff66', fontSize: '1.1rem' }}>📡 Scraper Performance & Integrity Matrix</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Tracked Car Profiles</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{health.totalTrackedModels}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Total Active Listings</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0070f3' }}>{health.activeListingsCount}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Car.gr Data Node Pool</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{health.totalCarGrActive}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#aaa' }}>AutoTriti Cache Blocks</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{health.totalAutoTritiModels}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Import Delta Inflow (Today)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00ff66' }}>+{health.newListingsImportedToday}</div>
        </div>
      </div>
    </div>
  );
};