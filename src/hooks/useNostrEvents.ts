import { useEffect, useState, useMemo } from 'react';
import { useNDK } from '../context/NostrProvider';
import { NDKEvent, type NDKFilter } from '@nostr-dev-kit/ndk';

export function useNostrEvents(filter: NDKFilter) {
  const { ndk } = useNDK();
  const [events, setEvents] = useState<Map<string, NDKEvent>>(new Map());

  useEffect(() => {
    if (!filter) return;

    const sub = ndk.subscribe(filter, { closeOnEose: false });

    sub.on('event', (event: NDKEvent) => {
      setEvents((prev) => {
        const newMap = new Map(prev);
        newMap.set(event.id, event);
        return newMap;
      });
    });

    return () => {
      sub.stop();
    };
  }, [ndk, filter]);

  const eventArray = useMemo(() => Array.from(events.values()), [events]);

  return eventArray;
}
