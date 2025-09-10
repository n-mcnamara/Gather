import React from 'react';
import { Marker, Circle } from 'react-leaflet';
import { useGeolocation } from '../hooks/useGeolocation';
import L from 'leaflet';

export default function UserMarker() {
  const { coordinates } = useGeolocation();

  if (!coordinates) return null;

  const center: [number, number] = [coordinates.lat, coordinates.lng];

  return (
    <>
      <Circle
        center={center}
        radius={100} // in meters
        pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
      />
      <Marker
        position={center}
        icon={L.divIcon({
          className: 'user-location-dot',
          html: '<div style="background-color: blue; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
          iconSize: [12, 12],
        })}
      />
    </>
  );
}