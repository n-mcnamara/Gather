import { useNDK } from "../context/NostrProvider";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { v4 as uuidv4 } from 'uuid';
import { useJoinCommunity } from "./useJoinCommunity";

interface GroupDetails {
    name: string;
    description: string;
}

export function usePublishGroup(refetchMyCommunities: () => void) {
  const { ndk } = useNDK();
  const joinCommunity = useJoinCommunity(refetchMyCommunities);

  async function publishGroup(details: GroupDetails) {
    const { name, description } = details;

    const ev = new NDKEvent(ndk);
    ev.kind = 30023;
    ev.content = description;

    const groupId = uuidv4();

    ev.tags = [
      ["d", "gather-community"],
      ["d", groupId],
      ["title", name],
      ["t", "community"],
    ];

    try {
        await ev.publish();
        console.log("Published Group:", ev.encode());
        
        await joinCommunity(ev);

        return true;
    } catch (e) {
        console.error("Failed to publish group", e);
        return false;
    }
  }

  return publishGroup;
}
