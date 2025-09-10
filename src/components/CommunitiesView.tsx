import React, { useState, useMemo } from 'react';
import CreateGroupForm from './CreateGroupForm';
import { useListAllCommunities } from '../hooks/useListAllCommunities';
import { useMyCommunities } from '../hooks/useMyCommunities';
import CommunityList from './CommunityList';
import CommunityPage from './CommunityPage';
import { NDKEvent } from '@nostr-dev-kit/ndk';

export default function CommunitiesView() {
  const allCommunities = useListAllCommunities();
  const { communities: myCommunities, refetch } = useMyCommunities();
  const [selectedCommunity, setSelectedCommunity] = useState<NDKEvent | null>(null);

  const myCommunityIds = useMemo(() => {
    return new Set(myCommunities.map(c => c.id));
  }, [myCommunities]);

  const isJoined = (community: any) => myCommunityIds.has(community.id);

  if (selectedCommunity) {
    return (
      <CommunityPage 
        community={selectedCommunity} 
        onBack={() => setSelectedCommunity(null)}
        refetchMyCommunities={refetch}
      />
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Communities</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <CommunityList 
            title="My Communities" 
            communities={myCommunities} 
            onCommunityClick={setSelectedCommunity}
          />
          <div className="mt-6">
            <CommunityList 
              title="Discover Communities" 
              communities={allCommunities} 
              refetch={refetch}
              isJoined={isJoined}
            />
          </div>
        </div>
        <div>
          <CreateGroupForm />
        </div>
      </div>
    </div>
  );
}
