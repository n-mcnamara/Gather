import { useEffect, useState, useCallback } from 'react';
import { useNDK } from '../context/NostrProvider';

// A simple cache to avoid re-fetching the graph on re-renders
const socialGraphCache = {
  myFollows: new Set<string>(),
  friendsFollows: new Map<string, Set<string>>(),
};

export function useSocialGraph() {
  const { ndk, user } = useNDK();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the initial graph (1st and 2nd degree)
  useEffect(() => {
    const fetchGraph = async () => {
      if (!user) return;

      // Fetch our own follow list
      const currentUser = ndk.getUser({ pubkey: user.pubkey });
      const myFollowsSet = await currentUser.follows();
      socialGraphCache.myFollows = new Set(Array.from(myFollowsSet).map(u => u.pubkey));

      // Fetch the follow lists of our friends
      const friends = Array.from(myFollowsSet);
      for (const friend of friends) {
        const friendFollowsSet = await friend.follows();
        const friendFollowsPubkeys = new Set(Array.from(friendFollowsSet).map(u => u.pubkey));
        socialGraphCache.friendsFollows.set(friend.pubkey, friendFollowsPubkeys);
      }
      setIsLoading(false);
    };

    fetchGraph();
  }, [ndk, user]);

  // Get the degree of separation for a single pubkey
  const getDegree = useCallback((targetPubkey: string): 1 | 2 | '?' => {
    if (socialGraphCache.myFollows.has(targetPubkey)) {
      return 1;
    }
    for (const friendsFollows of socialGraphCache.friendsFollows.values()) {
      if (friendsFollows.has(targetPubkey)) {
        return 2;
      }
    }
    return '?';
  }, []);

  // Placeholder for the on-demand deep search
  const findPath = async (targetPubkey: string): Promise<number | null> => {
    // This is where the breadth-first search would go.
    // For now, we'll simulate a delay and a "not found" state.
    console.log(`Deep search triggered for ${targetPubkey}`);
    return new Promise(resolve => setTimeout(() => resolve(null), 2000));
  };

  return { isLoading, getDegree, findPath };
}