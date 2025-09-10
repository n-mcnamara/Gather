import { useNDK } from '../context/NostrProvider';
import { NDKEvent } from '@nostr-dev-kit/ndk';

export function useKickUser(community: NDKEvent) {
  const { ndk } = useNDK();

  const kickUser = async (pubkeyToKick: string, reason: string) => {
    const dTag = community.tags.find(t => t[0] === 'd' && t[1] !== 'gather-community');
    if (!dTag) return;
    const communityId = dTag[1];
    const communityPointer = `30023:${community.pubkey}:${communityId}`;

    const kickEvent = new NDKEvent(ndk);
    kickEvent.kind = 30024; // Moderation Info Event
    kickEvent.content = reason;
    kickEvent.tags = [
      ['a', communityPointer],
      ['p', pubkeyToKick],
      ['action', 'kick'], // A tag to specify the moderation action
    ];

    try {
      await kickEvent.publish();
      alert(`User ${pubkeyToKick.substring(0, 8)}... has been kicked.`);
    } catch (e) {
      console.error('Failed to publish kick event', e);
      alert('Failed to kick user.');
    }
  };

  return kickUser;
}
