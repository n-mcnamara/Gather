import React from 'react';
import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNostrEvents } from '../hooks/useNostrEvents';
import { useLeaveCommunity } from '../hooks/useLeaveCommunity';
import { ArrowLeft } from 'lucide-react';
import { useNDK } from '../context/NostrProvider';
import { useCommunityMods } from '../hooks/useCommunityMods';
import ModerationControls from './ModerationControls';
import { useProfiles } from '../hooks/useProfiles';
import { useKickedUsers } from '../hooks/useKickedUsers';

interface CommunityPageProps {
  community: NDKEvent;
  onBack: () => void;
  refetchMyCommunities: () => void;
}

const EventList = ({ events, kickedUsers }: { events: NDKEvent[], kickedUsers: Set<string> }) => {
  const filteredEvents = events.filter(event => !kickedUsers.has(event.pubkey));
  
  if (filteredEvents.length === 0) {
    return <p className="text-gray-500">No events found for this community.</p>;
  }
  return (
    <div className="space-y-2">
      {filteredEvents.map(event => (
        <div key={event.id} className="p-3 border rounded-lg">
          <h4 className="font-bold">{event.tagValue('title')}</h4>
          <p className="text-sm text-gray-600">{event.content}</p>
        </div>
      ))}
    </div>
  );
};

const ModeratorList = ({ pubkeys }: { pubkeys: string[] }) => {
  // ... (same as before)
};

export default function CommunityPage({ community, onBack, refetchMyCommunities }: CommunityPageProps) {
  const { user } = useNDK();
  const dTag = community.tags.find(t => t[0] === 'd' && t[1] !== 'gather-community');
  const communityPointer = `30023:${community.pubkey}:${dTag ? dTag[1] : ''}`;
  
  const filter = React.useMemo(() => ({
    kinds: [31923],
    '#a': [communityPointer],
  }), [communityPointer]);

  const events = useNostrEvents(filter);
  const leaveCommunity = useLeaveCommunity(refetchMyCommunities);
  const moderators = useCommunityMods(community);
  const kickedUsers = useKickedUsers(community);

  const isModerator = user && (community.pubkey === user.pubkey || moderators.includes(user.pubkey));

  return (
    <div className="p-4">
      {/* ... (header) */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Community Events</h2>
          <EventList events={events} kickedUsers={kickedUsers} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Moderators</h2>
          <ModeratorList pubkeys={moderators} />

          <h2 className="text-xl font-semibold mb-2 mt-4">Actions</h2>
          <button
            onClick={() => leaveCommunity(community)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
          >
            Leave Community
          </button>

          {isModerator && <ModerationControls community={community} />}
        </div>
      </div>
    </div>
  );
}
