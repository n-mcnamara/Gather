import { useNDK } from "../context/NostrProvider";
import { NDKEvent, NDKRelaySet, NDKRelay } from "@nostr-dev-kit/ndk";
import { v4 as uuidv4 } from 'uuid';
import { findClosestRelay } from "../utils/geo";
import allRelays from '../utils/geo-relays.json';

const typedRelays: Record<string, { lat: number; lon: number }> = allRelays;

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
      ["g", `${lat},${lon}`],
      ["starts", startTime.toString()],
      ["ends",endTime.toString()],
      ["expires_at", endTime.toString()],
      ["t", "gather"],
    ];

    if (community) {
      ev.tags.push(["a", community]);
    }

    try {
      const closestRelayUrl = findClosestRelay(lat, lon);
      
      // Get the user's default relays from the pool
      const relaysToPublishTo = new Set<NDKRelay>(ndk.pool.relays.values());

      if (closestRelayUrl) {
        // Get or create an NDKRelay instance for the closest relay and add it
        const geoRelay = ndk.pool.getRelay(closestRelayUrl);
        relaysToPublishTo.add(geoRelay);
      }
      
      const relaySet = new NDKRelaySet(relaysToPublishTo, ndk);

      const publicationRelays = Array.from(relaysToPublishTo).map(r => {
        const geo = typedRelays[r.url] ? `(lat: ${typedRelays[r.url].lat}, lon: ${typedRelays[r.url].lon})` : '(geo not available)';
        return `  - ${r.url} ${geo}`;
      });
      console.log(`Publishing event to the following relays:\n${publicationRelays.join('\n')}`);

      // Use the original, working publish method on the event object
      await ev.publish(relaySet);
      console.log("Published Event:", ev.encode());

      if (user) {
        const rsvpEvent = new NDKEvent(ndk);
        rsvpEvent.kind = 31925;
        rsvpEvent.content = "I'm going!";
        rsvpEvent.tags = [
          ["a", `${ev.kind}:${user.pubkey}:${eventId}`],
          ["p", user.pubkey]
        ];
        await rsvpEvent.publish(relaySet);
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