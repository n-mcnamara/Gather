import React from 'react';
import { useMap } from 'react-leaflet';
import { LocateFixed } from 'lucide-react';

export default function CenterMapControl() {
  const map = useMap();

  const handleCenter = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.flyTo([latitude, longitude], 14);
      },
      (error) => {
        alert(`Error getting location: ${error.message}`);
      }
    );
  };

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button onClick={handleCenter} title="Center on my location">
          <LocateFixed size={18} />
        </button>
      </div>
    </div>
  );
}
