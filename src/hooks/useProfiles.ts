import { useEffect, useState } from 'react';
import { useNDK } from '../context/NostrProvider';
import { NDKUser } from '@nostr-dev-kit/ndk';

export function useProfiles(pubkeys: string[]) {
  const { ndk } = useNDK();
  const [users, setUsers] = useState<Map<string, NDKUser>>(new Map());

  useEffect(() => {
    if (pubkeys.length === 0) {
        setUsers(new Map());
        return;
    };

    const usersToFetch = pubkeys.map((pubkey) => ndk.getUser({ pubkey }));
    
    const fetchProfiles = async () => {
      const fetchedUsers = new Map<string, NDKUser>();
      for (const user of usersToFetch) {
        await user.fetchProfile();
        fetchedUsers.set(user.pubkey, user);
      }
      setUsers(fetchedUsers);
    };

    fetchProfiles();

  }, [ndk, JSON.stringify(pubkeys)]); // Stringify to compare array values

  return Array.from(users.values());
}
