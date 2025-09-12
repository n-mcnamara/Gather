import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';

interface MapControllerProps {
  center: [number, number] | null;
  recenterRequest: number;
}

export default function MapController({ center, recenterRequest }: MapControllerProps) {
  const map = useMap();
  const [hasCentered, setHasCentered] = useState(false);

  useEffect(() => {
    // Center the map if we have a center point and either:
    // 1. We haven't centered yet (initial load)
    // 2. A recenter has been explicitly requested
    if (center && (!hasCentered || recenterRequest > 0)) {
      map.flyTo(center, 14);
      setHasCentered(true);
    }
  }, [center, map, hasCentered, recenterRequest]);

  return null;
}
