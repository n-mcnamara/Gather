import React, { useState } from 'react';
import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNDK } from '../context/NostrProvider';
import { useCommunityMods } from '../hooks/useCommunityMods';
import { useKickUser } from '../hooks/useKickUser';

interface ModerationControlsProps {
  community: NDKEvent;
}

export default function ModerationControls({ community }: ModerationControlsProps) {
  const { ndk } = useNDK();
  const initialMods = useCommunityMods(community);
  const [mods, setMods] = useState<string[]>(initialMods);
  const [newMod, setNewMod] = useState('');
  const [kickPubkey, setKickPubkey] = useState('');
  const [kickReason, setKickReason] = useState('');
  const kickUser = useKickUser(community);

  const handleAddMod = () => {
    if (newMod.trim() && !mods.includes(newMod.trim())) {
      setMods([...mods, newMod.trim()]);
      setNewMod('');
    }
  };

  const handleRemoveMod = (pubkey: string) => {
    setMods(mods.filter(m => m !== pubkey));
  };

  const handlePublishMods = async () => {
    const dTag = community.tags.find(t => t[0] === 'd' && t[1] !== 'gather-community');
    if (!dTag) return;
    const communityId = dTag[1];
    const communityPointer = `30023:${community.pubkey}:${communityId}`;

    const modEvent = new NDKEvent(ndk);
    modEvent.kind = 30024;
    modEvent.content = "Moderator list for my Gather community.";
    modEvent.tags = [
      ['a', communityPointer],
      ...mods.map(m => ['p', m])
    ];

    try {
      await modEvent.publish();
      alert('Moderator list updated!');
    } catch (e) {
      console.error('Failed to publish moderator list', e);
      alert('Failed to update moderators.');
    }
  };

  const handleKick = () => {
    if (!kickPubkey.trim()) {
      alert('Please enter a pubkey to kick.');
      return;
    }
    kickUser(kickPubkey.trim(), kickReason.trim());
    setKickPubkey('');
    setKickReason('');
  };

  return (
    <div className="p-4 border rounded-lg mt-4">
      <h3 className="font-bold text-lg mb-2">Moderation Controls</h3>
      
      {/* Add/Remove Mods */}
      <div className="mb-4">
        <h4 className="font-semibold mb-1">Manage Moderators</h4>
        {/* ... (add/remove mod UI) */}
        <button onClick={handlePublishMods} className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg">
          Publish Moderator List
        </button>
      </div>

      {/* Kick User */}
      <div>
        <h4 className="font-semibold mb-1">Kick User</h4>
        <input
          type="text"
          placeholder="User pubkey to kick"
          value={kickPubkey}
          onChange={(e) => setKickPubkey(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
        />
        <textarea
          placeholder="Reason for kicking (optional)"
          value={kickReason}
          onChange={(e) => setKickReason(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
        />
        <button onClick={handleKick} className="mt-2 w-full px-4 py-2 bg-red-600 text-white rounded-lg">
          Kick User
        </button>
      </div>
    </div>
  );
}