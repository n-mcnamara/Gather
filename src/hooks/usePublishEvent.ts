import { useNDK } from "../context/NostrProvider";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { v4 as uuidv4 } from 'uuid';

interface EventDetails {
    title: string;
    summary: string;
    lat: number;
    lon: number;
    starts?: number;
    ends?: number;
    community?: string;
}

export function usePublishEvent() {
  const { ndk, user } = useNDK();

  async function publishEvent(details: EventDetails) {
    const { title, summary, lat, lon, community } = details;

    const ev = new NDKEvent(ndk);
    ev.kind = 31923;
    ev.content = summary;

    const eventId = uuidv4();
    
    const startTime = details.starts || Math.floor(Date.now() / 1000);
    const endTime = details.ends || startTime + (2 * 60 * 60);

    ev.tags = [
      ["d", eventId],
      ["title", title],
      ["summary", summary],
      ["g", `${lat},${lon}`], // Use comma-separated coordinates
      ["starts", startTime.toString()],
      ["ends", endTime.toString()],
      ["expires_at", endTime.toString()],
      ["t", "gather"],
    ];

    if (community) {
      ev.tags.push(["a", community]);
    }

    try {
      await ev.publish();
      console.log("Published Event:", ev.encode());

      if (user) {
        const rsvpEvent = new NDKEvent(ndk);
        rsvpEvent.kind = 31925;
        rsvpEvent.content = "I'm going!";
        rsvpEvent.tags = [
          ["a", `${ev.kind}:${user.pubkey}:${eventId}`],
          ["p", user.pubkey]
        ];
        await rsvpEvent.publish();
        console.log("Published auto-RSVP for creator.");
      }

      return true;
    } catch (e) {
      console.error("Failed to publish event or RSVP", e);
      return false;
    }
  }

  return publishEvent;
}