import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useJoinCommunity } from '../hooks/useJoinCommunity';
import { useLeaveCommunity } from '../hooks/useLeaveCommunity';
import { Lock } from 'lucide-react';

interface CommunityListProps {
  title: string;
  communities: NDKEvent[];
  refetch?: () => void;
  isJoined?: (community: NDKEvent) => boolean;
  onCommunityClick?: (community: NDKEvent) => void;
}

export default function CommunityList({ title, communities, refetch = () => {}, isJoined, onCommunityClick }: CommunityListProps) {
  const joinCommunity = useJoinCommunity(refetch);
  const leaveCommunity = useLeaveCommunity(refetch);

  const renderActionButton = (community: NDKEvent) => {
    const alreadyJoined = isJoined ? isJoined(community) : false;

    if (title === "My Communities") {
      return (
        <button 
          onClick={() => leaveCommunity(community)}
          className="px-3 py-1.5 text-white rounded-lg shadow-md text-sm bg-red-600 hover:bg-red-700"
        >
          Leave
        </button>
      );
    }

    if (alreadyJoined) {
      return (
        <button 
          onClick={() => leaveCommunity(community)}
          className="px-3 py-1.5 text-white rounded-lg shadow-md text-sm bg-red-600 hover:bg-red-700"
        >
          Leave
        </button>
      );
    }

    return (
      <button 
        onClick={() => joinCommunity(community)}
        className="px-3 py-1.5 text-white rounded-lg shadow-md text-sm bg-green-600 hover:bg-green-700"
      >
        Join
      </button>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {communities.length === 0 ? (
        <p className="text-gray-500">No communities found.</p>
      ) : (
        <div className="space-y-2">
          {communities.map((community) => {
            const isPrivate = community.tags.some(t => t[0] === 'private');
            return (
              <div key={community.id} className="p-3 border rounded-lg flex justify-between items-center">
                <div 
                  className={`cursor-${onCommunityClick ? 'pointer' : 'default'}`}
                  onClick={() => onCommunityClick && onCommunityClick(community)}
                >
                  <div className="flex items-center space-x-2">
                    {isPrivate && <Lock size={16} className="text-gray-500" />}
                    <h3 className="font-bold">{community.tagValue('title')}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{community.content}</p>
                </div>
                {renderActionButton(community)}
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}