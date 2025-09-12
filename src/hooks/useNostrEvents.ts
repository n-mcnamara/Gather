import { useEffect, useState, useMemo } from 'react';
import { useNDK } from '../context/NostrProvider';
import { NDKEvent, type NDKFilter, NDKRelaySet } from '@nostr-dev-kit/ndk';

export function useNostrEvents(filter: NDKFilter, relaySet?: NDKRelaySet) {
  const { ndk } = useNDK();
  const [events, setEvents] = useState<Map<string, NDKEvent>>(new Map());

  const filterString = useMemo(() => JSON.stringify(filter), [filter]);

  useEffect(() => {
    if (!filter) return;

    setEvents(new Map());

    const sub = ndk.subscribe(filter, { closeOnEose: false }, relaySet);

    sub.on('event', (event: NDKEvent) => {
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
  }, [ndk, filterString, relaySet]);

  const eventArray = useMemo(() => Array.from(events.values()), [events]);

  return eventArray;
}
