import { useEffect, useState } from 'react';
import { useNDK } from '../context/NostrProvider';
import { NDKEvent } from '@nostr-dev-kit/ndk';

export function useEventAttendance(event: NDKEvent) {
  const { ndk } = useNDK();
  const [attendees, setAttendees] = useState<Set<string>>(new Set());

  useEffect(() => {
    const eventId = event.tagValue('d');
    if (!eventId) return;

    const filter = {
      kinds: [31925],
      '#a': [`${event.kind}:${event.pubkey}:${eventId}`],
    };

    const sub = ndk.subscribe(filter, { closeOnEose: false });

    sub.on('event', (rsvpEvent: NDKEvent) => {
      setAttendees((prev) => new Set(prev).add(rsvpEvent.pubkey));
    });

    return () => {
      sub.stop();
    };
  }, [ndk, event]);

  return attendees;
}
