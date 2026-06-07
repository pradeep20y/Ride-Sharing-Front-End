import React, { useEffect } from 'react';
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
    popupAnchor: isCircle ? [0, -15] : [0, -34],
  });
};

const greenIcon = createCustomIcon('#2ecc71');
const redIcon = createCustomIcon('#e74c3c');
const driverIcon = createCustomIcon('#3498db', true);

// --- Camera Controller ---
function ManageMapCamera({ points, singleTargetZoom }) {
  const map = useMap();
  useEffect(() => {
    if (!points || points.length === 0) return;
    if (points.length === 1 && singleTargetZoom) {
      map.setView(points[0], singleTargetZoom);
    } else {
      const validPoints = points.filter(Boolean);
      if (validPoints.length > 0) {
        map.fitBounds(L.latLngBounds(validPoints), { padding: [50, 50] });
      }
    }
  }, [points, map, singleTargetZoom]);
  return null;
}

/**
 * SmartMap — Pure map renderer. Owns no UI controls.
 *
 * Props (PASSENGER role):
 *   pickupCoords   : [lat, lng] | null
 *   destCoords     : [lat, lng] | null
 *   routeCoords    : [[lat, lng], ...]  (computed upstream or here via effect)
 *
 * Props (DRIVER role):
 *   isOnline       : boolean
 *   driverCoords   : [lat, lng] | null
 *   driverError    : string | null
 */
export default function SmartMap({
  role,
  // Passenger props
  pickupCoords = null,
  destCoords = null,
  // Driver props
  isOnline = false,
  driverCoords = null,
  driverError = null,
}) {
  const chennaiCenter = [13.0827, 80.2707];

  // Route state lives here because it's purely a map concern —
  // it's derived from pickupCoords + destCoords and only displayed on the map.
  const [routeCoords, setRouteCoords] = React.useState([]);

  useEffect(() => {
    if (role !== 'PASSENGER' || !pickupCoords || !destCoords) {
      setRouteCoords([]);
      return;
    }
    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${pickupCoords[1]},${pickupCoords[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes?.length > 0) {
          setRouteCoords(data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]));
        }
      } catch (e) {
        console.error('Routing error', e);
      }
    };
    fetchRoute();
  }, [pickupCoords, destCoords, role]);

  // Camera target points
  const passengerCameraPoints =
    routeCoords.length > 0 ? routeCoords : [pickupCoords, destCoords].filter(Boolean);

  return (
    <div style={{ height: '500px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
      <MapContainer center={chennaiCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Camera */}
        {role === 'PASSENGER' && passengerCameraPoints.length > 0 && (
          <ManageMapCamera points={passengerCameraPoints} />
        )}
        {role === 'DRIVER' && isOnline && driverCoords && (
          <ManageMapCamera points={[driverCoords]} singleTargetZoom={16} />
        )}

        {/* Passenger overlays */}
        {role === 'PASSENGER' && pickupCoords && (
          <Marker position={pickupCoords} icon={greenIcon}>
            <Popup>Pickup Point</Popup>
          </Marker>
        )}
        {role === 'PASSENGER' && destCoords && (
          <Marker position={destCoords} icon={redIcon}>
            <Popup>Destination Point</Popup>
          </Marker>
        )}
        {role === 'PASSENGER' && routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{ color: '#3498db', weight: 5, opacity: 0.8 }}
          />
        )}

        {/* Driver overlays */}
        {role === 'DRIVER' && isOnline && driverCoords && (
          <Marker position={driverCoords} icon={driverIcon}>
            <Popup>Your Live Vehicle Tracking Node</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}