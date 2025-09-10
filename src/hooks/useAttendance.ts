import { useNDK } from '../context/NostrProvider';
import { NDKEvent } from '@nostr-dev-kit/ndk';

export function useAttendEvent() {
  const { ndk, user } = useNDK();

  const attend = async (event: NDKEvent) => {
    if (!user) {
      alert("Please log in to attend an event.");
      return;
    }

    const rsvpEvent = new NDKEvent(ndk);
    rsvpEvent.kind = 31925;
    rsvpEvent.content = "I'm going!";

    // Reference the event being attended
    rsvpEvent.tags = [
        ["a", `${event.kind}:${event.pubkey}:${event.tagValue("d")}`],
        ["p", event.pubkey]
    ];

    try {
      await rsvpEvent.publish();
      alert(`RSVP'd to event: ${event.tagValue('title')}`);
    } catch (e) {
      console.error("Failed to publish RSVP", e);
      alert("Failed to RSVP.");
    }
  };

  return attend;
}