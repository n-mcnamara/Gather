import { useEffect, useState } from 'react';
import { useNDK } from '../context/NostrProvider';
import { NDKEvent } from '@nostr-dev-kit/ndk';

export function useKickedUsers(community: NDKEvent) {
  const { ndk } = useNDK();
  const [kickedPubkeys, setKickedPubkeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const dTag = community.tags.find(t => t[0] === 'd' && t[1] !== 'gather-community');
    if (!dTag) return;
    const communityId = dTag[1];
    const communityPointer = `30023:${community.pubkey}:${communityId}`;

    const fetchKicks = async () => {
      const kickEvents = await ndk.fetchEvents({
        kinds: [30024],
        '#a': [communityPointer],
        '#action': ['kick'],
      });

      const pubkeys = new Set<string>();
      for (const event of kickEvents) {
        const pTag = event.tags.find(t => t[0] === 'p');
        if (pTag) {
          pubkeys.add(pTag[1]);
        }
      }
      setKickedPubkeys(pubkeys);
    };

    fetchKicks();
  }, [ndk, community]);

  return kickedPubkeys;
}
