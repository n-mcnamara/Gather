import { useNostrEvents } from './useNostrEvents';
import { useMemo } from 'react';

export function useListAllCommunities() {
  const filter = useMemo(() => ({
    kinds: [30023],
    '#d': ['gather-community'], // Filter by our unique identifier
  }), []);

  const communities = useNostrEvents(filter);

  return communities;
}
