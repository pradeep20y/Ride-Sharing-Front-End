import React from 'react';
import SmartMap from '../components/map/SmartMap';

export default function DriverPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Driver Console</h1>
      <p>Your current service availability dashboard.</p>
      {/* Mounts map tracking live browser device hardware GPS */}
      <SmartMap role="DRIVER" />
    </div>
  );
}