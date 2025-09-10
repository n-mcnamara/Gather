import { useState, useEffect, useCallback, useMemo } from 'react';
import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNDK } from '../context/NostrProvider';
import { useGeolocation } from './useGeolocation';
import L from 'leaflet';
import { parseGeo } from '../utils/geo';

// Store check-in status in memory to persist across re-renders
const checkedInEvents = new Map<string, string>(); // eventId -> checkInEventId

export function useProximity(event: NDKEvent) {
  const { ndk, tempSigner } = useNDK();
  const { coordinates } = useGeolocation();
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);

  const eventCoords = useMemo(() => {
    const geoTag = event.tagValue('g');
    if (!geoTag) return null;
    const coords = parseGeo(geoTag);
    if (!coords) return null;
    return L.latLng(coords.lat, coords.lon);
  }, [event]);

  const checkOut = useCallback(async () => {
    const checkInEventId = checkedInEvents.get(event.id);
    if (!checkInEventId) return;

    const deleteEvent = new NDKEvent(ndk);
    deleteEvent.kind = 5;
    deleteEvent.tags = [['e', checkInEventId]];

    // Sign with the temporary, anonymous key
    deleteEvent.signer = tempSigner;

    await deleteEvent.publish();
    checkedInEvents.delete(event.id);
    setIsCheckedIn(false);
  }, [ndk, event, tempSigner]);

  // Check distance and manage auto-checkout
  useEffect(() => {
    if (coordinates && eventCoords) {
      const userCoords = L.latLng(coordinates.lat, coordinates.lng);
      const dist = userCoords.distanceTo(eventCoords);
      setDistance(dist);

      if (dist < 200) {
        setCanCheckIn(true);
      } else {
        setCanCheckIn(false);
        if (isCheckedIn) {
          checkOut();
        }
      }
    }
  }, [coordinates, eventCoords, isCheckedIn, checkOut]);

  const checkIn = useCallback(async () => {
    const dTag = event.tagValue('d');
    if (!dTag) return;

    const checkInEvent = new NDKEvent(ndk);
    checkInEvent.kind = 40001; // Ephemeral event
    checkInEvent.content = "ping";
    checkInEvent.tags = [['a', `${event.kind}:${event.pubkey}:${dTag}`]];
    
    // Sign with the temporary, anonymous key
    checkInEvent.signer = tempSigner;
    
    await checkInEvent.publish();
    checkedInEvents.set(event.id, checkInEvent.id);
    setIsCheckedIn(true);
  }, [ndk, event, tempSigner]);

  return { canCheckIn, isCheckedIn, checkIn, distance };
}
