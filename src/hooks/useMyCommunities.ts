import { useEffect, useState, useCallback } from 'react';
import { useNDK } from '../context/NostrProvider';
import { NDKEvent } from '@nostr-dev-kit/ndk';

export function useMyCommunities() {
  const { ndk, user } = useNDK();
  const [communities, setCommunities] = useState<NDKEvent[]>([]);

  const fetchCommunities = useCallback(async () => {
    if (!user) return;

    const listEvent = await ndk.fetchEvent({
      kinds: [10002],
      authors: [user.pubkey],
    });

    if (!listEvent) {
      setCommunities([]);
      return;
    }

    const communityPointers = listEvent.tags
      .filter(t => t[0] === 'a' && t[1].startsWith('30023:'))
      .map(t => t[1]);

    if (communityPointers.length === 0) {
      setCommunities([]);
      return;
    }
    
    const filters = communityPointers.map(p => {
        const [, pubkey, d] = p.split(':');
        return {
            kinds: [30023],
            authors: [pubkey],
            '#d': [d]
        }
    });

    if (filters.length === 0) return;

    const communityEvents = await ndk.fetchEvents(filters);
    const gatherCommunities = Array.from(communityEvents).filter(e => e.tags.some(t => t[0] === 'd' && t[1] === 'gather-community'));

    setCommunities(gatherCommunities);
  }, [ndk, user]);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  return { communities, refetch: fetchCommunities };
}
