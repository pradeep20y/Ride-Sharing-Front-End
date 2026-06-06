import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- Custom Icons Factory ---
const createCustomIcon = (color, isCircle = false) => {
  return L.divIcon({
    html: isCircle 
      ? `<svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
           <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
           <circle cx="12" cy="12" r="4" fill="white"/>
         </svg>`
      : `<svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
           <path d="M12.5 0C5.596 0 0 5.596 0 12.5C0 21.875 12.5 41 12.5 41S25 21.875 25 12.5C25 5.596 19.404 0 12.5 0Z" fill="${color}"/>
           <circle cx="12.5" cy="12.5" r="4" fill="white"/>
         </svg>`,
    className: 'custom-map-marker',
    iconSize: isCircle ? [30, 30] : [25, 41],
    iconAnchor: isCircle ? [15, 15] : [12.5, 41],
    popupAnchor: isCircle ? [0, -15] : [0, -34]
  });
};

const greenIcon = createCustomIcon('#2ecc71'); // Pickup
const redIcon = createCustomIcon('#e74c3c');   // Destination
const driverIcon = createCustomIcon('#3498db', true); // Driver Radar Dot

// Camera controller component
function ManageMapCamera({ points, singleTargetZoom }) {
  const map = useMap();
  useEffect(() => {
    if (points && points.length > 0) {
      if (points.length === 1 && singleTargetZoom) {
        map.setView(points[0], singleTargetZoom);
      } else {
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [points, map, singleTargetZoom]);
  return null;
}

export default function SmartMap({ role }) {
  const chennaiCenter = [13.0827, 80.2707];

  // Form State (Passengers Only)
  const [pickupInput, setPickupInput] = useState('');
  const [destInput, setDestInput] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);

  // Live Location State (Drivers Only)
  const [driverCoords, setDriverCoords] = useState(null);
  const [driverError, setDriverError] = useState(null);
  
  // 💡 NEW: Driver Availability Toggle State (Defaults to true/Online)
  const [isOnline, setIsOnline] = useState(true);

  // --- LOGIC 1: Geocoding (Passenger) ---
  const geocodeAddress = async (address, setCoordsState) => {
    if (!address.trim()) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        setCoordsState([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    } catch (e) { console.error("Geocoding error", e); }
  };

  const handleKeyDown = (e, address, setCoordsState) => {
    if (e.key === 'Enter') geocodeAddress(address, setCoordsState);
  };

  // --- LOGIC 2: Driving Route Routing (Passenger) ---
  useEffect(() => {
    if (role !== 'PASSENGER' || !pickupCoords || !destCoords) return;
    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${pickupCoords[1]},${pickupCoords[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const flipped = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          setRouteCoords(flipped);
        }
      } catch (e) { console.error("Routing error", e); }
    };
    fetchRoute();
  }, [pickupCoords, destCoords, role]);

  // --- LOGIC 3: Hardware Geolocation (Driver) ---
  // 💡 NEW: This hook now triggers whenever 'role' OR 'isOnline' switches status
  useEffect(() => {
    if (role !== 'DRIVER') return;

    // If driver switches to offline, clear out their coordinates immediately
    if (!isOnline) {
      setDriverCoords(null);
      setDriverError(null);
      return;
    }

    if (!navigator.geolocation) {
      setDriverError("GPS tracking unsupported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => setDriverCoords([pos.coords.latitude, pos.coords.longitude]),
      () => setDriverError("Location access denied. Turn on browser GPS permissions."),
      { enableHighAccuracy: true }
    );
  }, [role, isOnline]);

  const handleRequestRide = () => {
    if (pickupCoords && destCoords) {
      console.log("🚖 --- RIDE DISPATCH DATA --- 🚖", {
        pickup: { address: pickupInput, coords: pickupCoords },
        destination: { address: destInput, coords: destCoords }
      });
    } else {
      alert("Please map both points first.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      
      {/* PASSENGER UI PANEL */}
      {role === 'PASSENGER' && (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', background: '#f5f5f5', padding: '15px', borderRadius: '8px', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Pickup (Green)</label>
              <input
                type="text"
                placeholder="Press Enter to locate"
                value={pickupInput}
                onChange={(e) => setPickupInput(e.target.value)}
                onBlur={() => geocodeAddress(pickupInput, setPickupCoords)}
                onKeyDown={(e) => handleKeyDown(e, pickupInput, setPickupCoords)}
                style={{ padding: '8px', width: '220px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Destination (Red)</label>
              <input
                type="text"
                placeholder="Press Enter to locate"
                value={destInput}
                onChange={(e) => setDestInput(e.target.value)}
                onBlur={() => geocodeAddress(destInput, setDestCoords)}
                onKeyDown={(e) => handleKeyDown(e, destInput, setDestCoords)}
                style={{ padding: '8px', width: '220px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>
          <button onClick={handleRequestRide} style={{ padding: '10px 20px', background: '#1abc9c', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            Request a Ride
          </button>
        </div>
      )}

      {/* DRIVER UI PANEL WITH TOP RIGHT TOGGLE */}
      {role === 'DRIVER' && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          background: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '8px', 
          borderLeft: `5px solid ${isOnline ? '#2ecc71' : '#95a5a6'}` 
        }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#2c3e50' }}>Console Connection Status</h3>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: isOnline ? '#27ae60' : '#7f8c8d' }}>
              {isOnline 
                ? (driverError ? `⚠️ ${driverError}` : "🟢 Online — Syncing real-time road mapping coordinates") 
                : "🔴 Offline — Disconnected from tracking network"}
            </p>
          </div>

          {/* 💡 NEW: Top Right Status Switch Button */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            style={{
              padding: '8px 20px',
              background: isOnline ? '#2ecc71' : '#e74c3c',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
              transition: 'background 0.2s ease'
            }}
          >
            {isOnline ? "Go Offline" : "Go Online"}
          </button>
        </div>
      )}

      {/* THE ACTUAL MAP LAYER CANVAS */}
      <div style={{ height: '500px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
        <MapContainer center={chennaiCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Dynamic Camera Operations */}
          {role === 'PASSENGER' && (
            <ManageMapCamera points={routeCoords.length > 0 ? routeCoords : [pickupCoords, destCoords].filter(Boolean)} />
          )}
          {/* 💡 NEW: Camera will only track and move if driver is explicitly online */}
          {role === 'DRIVER' && isOnline && driverCoords && (
            <ManageMapCamera points={[driverCoords]} singleTargetZoom={16} />
          )}

          {/* Contextual Pin Overlays (Passenger) */}
          {role === 'PASSENGER' && pickupCoords && (
            <Marker position={pickupCoords} icon={greenIcon}><Popup>Pickup Point</Popup></Marker>
          )}
          {role === 'PASSENGER' && destCoords && (
            <Marker position={destCoords} icon={redIcon}><Popup>Destination Point</Popup></Marker>
          )}
          {role === 'PASSENGER' && routeCoords.length > 0 && (
            <Polyline positions={routeCoords} pathOptions={{ color: '#3498db', weight: 5, opacity: 0.8 }} />
          )}

          {/* Contextual Pin Overlays (Driver) */}
          {/* 💡 NEW: Marker renders ONLY if role is DRIVER AND they are online */}
          {role === 'DRIVER' && isOnline && driverCoords && (
            <Marker position={driverCoords} icon={driverIcon}><Popup>Your Live Vehicle Tracking Node</Popup></Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}