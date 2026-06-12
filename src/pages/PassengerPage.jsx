import React, { useState } from 'react';
import SmartMap from '../components/map/SmartMap';
import { geocodeAddress } from '../service/maps/geocodeService';
import api from '../api/axiosInstance';
import useAuth from '../auth/context/AuthContext';
import { connectStomp, subscribeStomp } from '../service/stomp/stompService';

export default function PassengerPage() {
  const [pickupInput, setPickupInput] = useState('');
  const [destInput, setDestInput]     = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destCoords, setDestCoords]     = useState(null);
  const [rideType, setRideType] = useState('ECONOMY');
  const {user,userType,token} = useAuth();
  // Resolve a field on Enter key or on blur
  const resolvePickup = async () => {
    const coords = await geocodeAddress(pickupInput);
    setPickupCoords(coords);
  };

  const resolveDest = async () => {
    const coords = await geocodeAddress(destInput);
    setDestCoords(coords);
  };

  const handleRequestRide = async () => {
    if (!pickupCoords || !destCoords) {
      alert('Please map both points first.');
      return;
    }
    // rideType = ECONOMY, CONFORT, PREMIUM
    const body = {
      passengerId: user.profileId,
      pickupLatitude: pickupCoords[0],
      pickupLongitude: pickupCoords[1],
      pickupAddress: pickupInput,
      dropoffLatitude: destCoords[0],
      dropoffLongitude: destCoords[1],
      dropoffAddress: destInput,
      rideType: rideType
    }
    const response = await api.post("/rides/request",body);
    //TODO 1 : right After the data is receiver i want to open the websock and connect it to the backend, displaying a spinner which produces resonating like design to tell driver is requesting.
    if (response.data) {
      console.log(response.data);
        connectStomp(userType, token, () => {
            subscribeStomp(`/topic/passenger/${user.profileId}`, (data) => {
                console.log('Driver update received:', data);
            });
        });
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Ride Type</label>
            <select 
              value={rideType} 
              onChange={(e) => setRideType(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="ECONOMY">Economy</option>
              <option value="COMFORT">Comfort</option>
              <option value="PREMIUM">Premium</option>
            </select>
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