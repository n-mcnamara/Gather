import { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';

interface GeolocationState {
  coordinates: { lat: number; lng: number } | null;
  error: string | null;
}

export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationState>({
    coordinates: null,
    error: null,
  });

  useEffect(() => {
    const getCurrentPosition = async () => {
      try {
        // Use Capacitor's high-performance geolocation plugin
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
        });
        setLocation({
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
        });
      } catch (e: any) {
        // Fallback to browser's geolocation if the plugin fails (e.g., on web)
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition) => {
              setLocation({
                coordinates: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
                error: null,
              });
            },
            (error: GeolocationPositionError) => {
              setLocation(l => ({ ...l, error: error.message }));
            }
          );
        } else {
          setLocation(l => ({ ...l, error: 'Geolocation is not supported.' }));
        }
      }
    };

    getCurrentPosition();
  }, []);

  return location;
}