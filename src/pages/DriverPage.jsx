import React, { useState, useEffect } from 'react';
import SmartMap from '../components/map/SmartMap';

export default function DriverPage() {
  const [isOnline, setIsOnline]       = useState(false);
  const [driverCoords, setDriverCoords] = useState(null);
  const [driverError, setDriverError]   = useState(null);

  // Whenever the driver flips online, ask the browser for their location.
  // When they go offline, wipe the coordinates immediately.
  useEffect(() => {
    if (!isOnline) {
      setDriverCoords(null);
      setDriverError(null);
      return;
    }

    if (!navigator.geolocation) {
      setDriverError('GPS tracking unsupported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDriverCoords([pos.coords.latitude, pos.coords.longitude]);
        setDriverError(null);
      },
      () => setDriverError('Location access denied — enable browser GPS permissions.'),
      { enableHighAccuracy: true }
    );
  }, [isOnline]);


  const handleButton = () =>{
    setIsOnline((prev) => !prev);
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Driver Console</h1>
      <p>Your current service availability dashboard.</p>

      {/* Availability toggle — lives in the page for future business logic hooks */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f5f5f5',
          padding: '15px',
          borderRadius: '8px',
          borderLeft: `5px solid ${isOnline ? '#2ecc71' : '#95a5a6'}`,
          marginBottom: '15px',
        }}
      >
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#2c3e50' }}>
            Connection Status
          </h3>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: isOnline ? '#27ae60' : '#7f8c8d' }}>
            {isOnline
              ? driverError
                ? `⚠️ ${driverError}`
                : '🟢 Online — Syncing real-time GPS coordinates'
              : '🔴 Offline — Disconnected from tracking network'}
          </p>
        </div>

        <button
          onClick={handleButton}
          style={{
            padding: '8px 20px',
            background: isOnline ? '#2ecc71' : '#e74c3c',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            transition: 'background 0.2s ease',
          }}
        >
          {isOnline ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      {/* Map receives online status + resolved coords — renders, nothing more */}
      <SmartMap
        role="DRIVER"
        isOnline={isOnline}
        driverCoords={driverCoords}
        driverError={driverError}
      />
    </div>
  );
}