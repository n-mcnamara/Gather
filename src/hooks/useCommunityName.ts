import { useEffect, useState } from 'react';
import { useNDK } from '../context/NostrProvider';

export function useCommunityName(aTag: string | undefined) {
  const { ndk } = useNDK();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (!aTag) return;

    const fetchName = async () => {
      const [kind, pubkey, d] = aTag.split(':');
      const filter = {
        kinds: [parseInt(kind)],
        authors: [pubkey],
        '#d': [d],
      };
      const event = await ndk.fetchEvent(filter);
      if (event) {
        setName(event.tagValue('title') || null);
      }
    };

    fetchName();
  }, [ndk, aTag]);

  return name;
}