import { useNDK } from '../context/NostrProvider';
import { NDKEvent } from '@nostr-dev-kit/ndk';

export function useLeaveCommunity(refetch: () => void) {
  const { ndk, user } = useNDK();

  const leaveCommunity = async (communityEvent: NDKEvent) => {
    if (!user) {
      alert('Please log in to leave a community.');
      return;
    }

    const listEvent = await ndk.fetchEvent({
      kinds: [10002],
      authors: [user.pubkey],
    });

    if (!listEvent) {
      alert("Could not find your list of communities.");
      return;
    }

    const dTag = communityEvent.tags.find(t => t[0] === 'd' && t[1] !== 'gather-community');
    if (!dTag) return;
    const communityId = dTag[1];
    const communityTagToRemove = `30023:${communityEvent.pubkey}:${communityId}`;

    const newList = new NDKEvent(ndk);
    newList.kind = 10002;
    newList.tags = listEvent.tags.filter(t => t[1] !== communityTagToRemove);

    try {
      await newList.publish();
      alert(`Successfully left ${communityEvent.tagValue('title')}.`);
      refetch();
    } catch (e) {
      console.error('Failed to leave community', e);
      alert('Failed to leave community.');
    }
  };

  return leaveCommunity;
}
