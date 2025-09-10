import { useNDK } from '../context/NostrProvider';
import { NDKEvent } from '@nostr-dev-kit/ndk';

export function useUnattendEvent() {
  const { ndk, user } = useNDK();

  const unattend = async (event: NDKEvent) => {
    if (!user) {
      alert("Please log in to unattend an event.");
      return;
    }

    // Find the user's original RSVP event
    const eventId = event.tagValue('d');
    const filter = {
      kinds: [31925],
      authors: [user.pubkey],
      '#a': [`${event.kind}:${event.pubkey}:${eventId}`],
    };

    const originalRsvp = await ndk.fetchEvent(filter);

    if (originalRsvp) {
      try {
        await originalRsvp.delete("I'm no longer going.");
        alert("You have successfully un-attended the event.");
      } catch (e) {
        console.error("Failed to delete RSVP", e);
        alert("Failed to un-attend.");
      }
    } else {
      console.warn("Could not find original RSVP to delete.");
    }
  };

  return unattend;
}
