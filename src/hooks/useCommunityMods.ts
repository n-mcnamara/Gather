import { useEffect, useState } from 'react';
import { useNDK } from '../context/NostrProvider';
import { NDKEvent, type NDKFilter, NDKKind } from '@nostr-dev-kit/ndk';

export function useCommunityMods(community: NDKEvent) {
  const { ndk } = useNDK();
  const [moderators, setModerators] = useState<string[]>([]);

  useEffect(() => {
    const dTag = community.tags.find(t => t[0] === 'd' && t[1] !== 'gather-community');
    if (!dTag) return;
    const communityId = dTag[1];
    const communityPointer = `30023:${community.pubkey}:${communityId}`;

    const fetchMods = async () => {
      const filter: NDKFilter = {
        kinds: [30024 as NDKKind],
        authors: [community.pubkey], // Only the creator can define mods
        '#a': [communityPointer],
      };
      const modEvent = await ndk.fetchEvent(filter);

      if (modEvent) {
        const modPubkeys = modEvent.tags.filter(t => t[0] === 'p').map(t => t[1]);
        setModerators(modPubkeys);
      }
    };

    fetchMods();
  }, [ndk, community]);

  return moderators;
}