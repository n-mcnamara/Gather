import { useMemo } from 'react';
import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNostrEvents } from '../hooks/useNostrEvents';
import { useLeaveCommunity } from '../hooks/useLeaveCommunity';
import { ArrowLeft } from 'lucide-react';

interface CommunityPageProps {
  community: NDKEvent;
  onBack: () => void;
  refetchMyCommunities: () => void;
}

const EventList = ({ events }: { events: NDKEvent[] }) => {
  if (events.length === 0) {
    return <p className="text-gray-500">No events found for this community.</p>;
  }
  return (
    <div className="space-y-2">
      {events.map(event => (
        <div key={event.id} className="p-3 border rounded-lg">
          <h4 className="font-bold">{event.tagValue('title')}</h4>
          <p className="text-sm text-gray-600">{event.content}</p>
        </div>
      ))}
    </div>
  );
};

export default function CommunityPage({ community, onBack, refetchMyCommunities }: CommunityPageProps) {
  const dTag = community.tags.find(t => t[0] === 'd' && t[1] !== 'gather-community');
  const communityPointer = `30023:${community.pubkey}:${dTag ? dTag[1] : ''}`;
  
  const filter = useMemo(() => ({
    kinds: [31923],
    '#a': [communityPointer],
  }), [communityPointer]);

  const events = useNostrEvents(filter);
  const leaveCommunity = useLeaveCommunity(refetchMyCommunities);

  return (
    <div className="p-4">
      <button onClick={onBack} className="flex items-center space-x-2 text-blue-600 hover:underline mb-4">
        <ArrowLeft size={18} />
        <span>Back to Communities</span>
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{community.tagValue('title')}</h1>
        <p className="text-gray-600 mt-2">{community.content}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Community Events</h2>
          <EventList events={events} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 mt-4">Actions</h2>
          <button
            onClick={() => leaveCommunity(community)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
          >
            Leave Community
          </button>
        </div>
      </div>
    </div>
  );
}
