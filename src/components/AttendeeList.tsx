import React from 'react';
import { useProfiles } from '../hooks/useProfiles';
import { NDKUser } from '@nostr-dev-kit/ndk';
import { useSocialGraph } from '../hooks/useSocialGraph';
import DegreeBadge from './DegreeBadge';

interface AttendeeListProps {
  pubkeys: string[];
  creatorPubkey: string;
}

const Avatar = ({ user }: { user: NDKUser }) => {
  const imageUrl = user.profile?.image || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.npub}`;
  return <img src={imageUrl} alt={user.profile?.name || 'avatar'} className="w-8 h-8 rounded-full" />;
};

export default function AttendeeList({ pubkeys, creatorPubkey }: AttendeeListProps) {
  const users = useProfiles(pubkeys);
  const { getDegree, findPath } = useSocialGraph();

  if (pubkeys.length === 0) {
    return <div className="text-sm text-gray-600">No one is going yet.</div>;
  }

  return (
    <div>
      <h4 className="font-bold text-sm mb-2">Who's Going</h4>
      <div className="flex flex-col space-y-2">
        {users.map((user) => (
          <div key={user.npub} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar user={user} />
              <span className="text-sm">{user.profile?.name || user.npub.substring(0, 12)}</span>
              {user.pubkey === creatorPubkey && (
                <span className="px-2 py-0.5 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">
                  Creator
                </span>
              )}
            </div>
            <DegreeBadge 
              degree={getDegree(user.pubkey)} 
              onDeepSearch={() => findPath(user.pubkey)} 
            />
          </div>
        ))}
        {users.length < pubkeys.length && (
          <div className="text-sm text-gray-500">Loading profiles...</div>
        )}
      </div>
    </div>
  );
}
