import React, { useState } from 'react';
import SmartMap from '../components/map/SmartMap';

// Geocode a plain-text address via Nominatim and return [lat, lng] or null.
async function geocodeAddress(address) {
  if (!address.trim()) return null;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );
    const data = await res.json();
    if (data?.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (e) {
    console.error('Geocoding error', e);
  }
  return null;
}

export default function PassengerPage() {
  const [pickupInput, setPickupInput] = useState('');
  const [destInput, setDestInput]     = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destCoords, setDestCoords]     = useState(null);

  // Resolve a field on Enter key or on blur
  const resolvePickup = async () => {
    const coords = await geocodeAddress(pickupInput);
    setPickupCoords(coords);
  };

  const resolveDest = async () => {
    const coords = await geocodeAddress(destInput);
    setDestCoords(coords);
  };

  const handleRequestRide = () => {
    if (!pickupCoords || !destCoords) {
      alert('Please map both points first.');
      return;
    }
    // TODO: dispatch ride request to backend
    console.log('🚖 RIDE DISPATCH', {
      pickup:      { address: pickupInput, coords: pickupCoords },
      destination: { address: destInput,   coords: destCoords  },
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome, Rider</h1>
      <p>Where are we heading today?</p>

      {/* Address Inputs — live in the page, not the map */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          background: '#f5f5f5',
          padding: '15px',
          borderRadius: '8px',
          gap: '15px',
          marginBottom: '15px',
        }}
      >
        <div style={{ display: 'flex', gap: '15px' }}>
          {/* Pickup */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Pickup (Green)</label>
            <input
              type="text"
              placeholder="Press Enter to locate"
              value={pickupInput}
              onChange={(e) => setPickupInput(e.target.value)}
              onBlur={resolvePickup}
              onKeyDown={(e) => e.key === 'Enter' && resolvePickup()}
              style={{
                padding: '8px',
                width: '220px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          </div>

          {/* Destination */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Destination (Red)</label>
            <input
              type="text"
              placeholder="Press Enter to locate"
              value={destInput}
              onChange={(e) => setDestInput(e.target.value)}
              onBlur={resolveDest}
              onKeyDown={(e) => e.key === 'Enter' && resolveDest()}
              style={{
                padding: '8px',
                width: '220px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          </div>
        </div>

        <button
          onClick={handleRequestRide}
          style={{
            padding: '10px 20px',
            background: '#1abc9c',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Request a Ride
        </button>
      </div>

      {/* Map receives resolved coordinates only — no UI logic inside */}
      <SmartMap
        role="PASSENGER"
        pickupCoords={pickupCoords}
        destCoords={destCoords}
      />
    </div>
  );
}