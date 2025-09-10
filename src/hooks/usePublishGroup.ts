import { useNDK } from "../context/NostrProvider";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { v4 as uuidv4 } from 'uuid';

interface GroupDetails {
    name: string;
    description: string;
    isPrivate: boolean;
}

export function usePublishGroup() {
  const { ndk } = useNDK();

  async function publishGroup(details: GroupDetails) {
    const { name, description, isPrivate } = details;

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

    if (isPrivate) {
      ev.tags.push(["private"]);
    }

    try {
        await ev.publish();
        console.log("Published Group:", ev.encode());
        return true;
    } catch (e) {
        console.error("Failed to publish group", e);
        return false;
    }
  }

  return publishGroup;
}
