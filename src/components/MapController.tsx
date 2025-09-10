import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapControllerProps {
  center: [number, number] | null;
}

export default function MapController({ center }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, 14);
    }
  }, [center, map]);

  return null;
}
