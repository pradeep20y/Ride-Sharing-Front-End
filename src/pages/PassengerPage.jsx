import React from 'react';
import SmartMap from '../components/map/SmartMap';

export default function PassengerPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome, Rider</h1>
      <p>Where are we heading today?</p>
      {/* Mounts map with full routing controls */}
      <SmartMap role="PASSENGER" />
    </div>
  );
}