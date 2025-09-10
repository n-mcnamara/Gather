import { useNDK } from '../context/NostrProvider';
import { NDKEvent } from '@nostr-dev-kit/ndk';

export function useJoinCommunity(refetch: () => void) {
  const { ndk, user } = useNDK();

  const joinCommunity = async (communityEvent: NDKEvent) => {
    if (!user) {
      alert('Please log in to join a community.');
      return;
    }

    const listEvent = await ndk.fetchEvent({
      kinds: [10002],
      authors: [user.pubkey],
    });

    const dTag = communityEvent.tags.find(t => t[0] === 'd' && t[1] !== 'gather-community');
    if (!dTag) {
        console.error("Community event is missing a unique d tag.", communityEvent);
        alert("Cannot join this community: invalid format.");
        return;
    }
    const communityId = dTag[1];
    const newCommunityTag = ['a', `30023:${communityEvent.pubkey}:${communityId}`];

    const newList = new NDKEvent(ndk);
    newList.kind = 10002;
    newList.tags = listEvent ? listEvent.tags : [];
    
    if (newList.tags.some(t => t[1] === newCommunityTag[1])) {
        alert("You've already joined this community.");
        return;
    }

    newList.tags.push(newCommunityTag);

    try {
      await newList.publish();
      alert(`Successfully joined ${communityEvent.tagValue('title')}!`);
      refetch();
    } catch (e) {
      console.error('Failed to join community', e);
      alert('Failed to join community.');
    }
  };

  return joinCommunity;
}
