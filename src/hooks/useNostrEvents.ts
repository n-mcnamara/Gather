import { useEffect, useState, useMemo } from 'react';
import { useNDK } from '../context/NostrProvider';
import { NDKEvent, type NDKFilter } from '@nostr-dev-kit/ndk';

export function useNostrEvents(filter: NDKFilter) {
  const { ndk } = useNDK();
  const [events, setEvents] = useState<Map<string, NDKEvent>>(new Map());

  // Create a stable string representation of the filter for the dependency array
  const filterString = useMemo(() => JSON.stringify(filter), [filter]);

  useEffect(() => {
    if (!filter) return;

    // Clear events when the filter changes
    setEvents(new Map());

    const sub = ndk.subscribe(filter, { closeOnEose: false });

    sub.on('event', (event: NDKEvent) => {
      // Ignore duplicate events
      if (events.has(event.id)) return;
      
      setEvents((prev) => {
        const newMap = new Map(prev);
        newMap.set(event.id, event);
        return newMap;
      });
    });

    return () => {
      sub.stop();
    };
  }, [ndk, filterString]); // Use the stable string representation

  const eventArray = useMemo(() => Array.from(events.values()), [events]);

  return eventArray;
}