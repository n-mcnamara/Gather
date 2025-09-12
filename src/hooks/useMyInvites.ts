import { useState, useEffect } from 'react';
import { useNDK } from '../context/NostrProvider';
import { NDKEvent, NDKKind, type NDKFilter } from '@nostr-dev-kit/ndk';

export function useMyInvites() {
  const { ndk, user } = useNDK();
  const [invites, setInvites] = useState<NDKEvent[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchInvites = async () => {
      const filter: NDKFilter = {
        kinds: [444 as NDKKind],
        '#p': [user.pubkey],
      };
      const inviteEvents = await ndk.fetchEvents(filter);
      setInvites(Array.from(inviteEvents));
    };

    fetchInvites();
  }, [ndk, user]);

  return invites;
}
