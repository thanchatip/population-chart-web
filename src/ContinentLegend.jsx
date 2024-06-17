import React from 'react';
import './ContinentLegend.css';

const ContinentLegend = () => {
  const continents = [
    { name: 'Asia', color: '#1f77b4' },
    { name: 'Europe', color: '#ff7f0e' },
    { name: 'Africa', color: '#2ca02c' },
    { name: 'Oceania', color: '#d62728' },
    { name: 'Americas', color: '#9467bd' }
  ];

  return (
    <div className="continent-legend">
        <span className="region-label">Regions:</span>
      {continents.map((continent) => (
        <div key={continent.name} className="continent-legend-item">
          <div className="legend-color" style={{ backgroundColor: continent.color }}></div>
          <div className="legend-text">{continent.name}</div>
        </div>
      ))}
    </div>
  );
};

export default ContinentLegend;
