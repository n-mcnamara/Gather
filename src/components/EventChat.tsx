import { useState } from 'react';
import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useEventChat } from '../hooks/useEventChat';
import { useProfiles } from '../hooks/useProfiles';
import { NDKUser } from '@nostr-dev-kit/ndk';
import { useKickedUsers } from '../hooks/useKickedUsers';

const ChatMessage = ({ event }: { event: NDKEvent }) => {
  const user = useProfiles([event.pubkey])[0];

  const Avatar = ({ user }: { user: NDKUser | undefined }) => {
    const imageUrl = user?.profile?.image || `https://api.dicebear.com/8.x/identicon/svg?seed=${event.author.npub}`;
    return <img src={imageUrl} alt={user?.profile?.name || 'avatar'} className="w-6 h-6 rounded-full" />;
  };

  return (
    <div className="flex items-start space-x-2 text-sm">
      <Avatar user={user} />
      <div>
        <span className="font-bold">{user?.profile?.name || event.author.npub.substring(0, 12)}</span>
        <p className="text-gray-700">{event.content}</p>
      </div>
    </div>
  );
};

export default function EventChat({ event }: { event: NDKEvent }) {
  const { messages, sendMessage } = useEventChat(event);
  const [newMessage, setNewMessage] = useState('');
  
  // Find the community this event belongs to
  const communityTag = event.tags.find(t => t[0] === 'a' && t[1].startsWith('30023:'));
  
  // HACK: Reconstruct a dummy community event to pass to the useKickedUsers hook.
  // This is necessary because the chat component only has access to the event,
  // not the full community object. A future refactor could involve passing the
  // community object down through the component tree.
  const communityEvent = new NDKEvent();
  if (communityTag) {
      const [, pubkey, d] = communityTag[1].split(':');
      communityEvent.pubkey = pubkey;
      communityEvent.tags = [['d', d]];
  }
  const kickedUsers = useKickedUsers(communityEvent);
  
  const filteredMessages = messages.filter(msg => !kickedUsers.has(msg.pubkey));

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className="mt-4 pt-4 border-t">
      <h4 className="font-bold text-sm mb-2">Event Chat</h4>
      <div className="space-y-2 max-h-48 overflow-y-auto mb-2 pr-2">
        {filteredMessages.map((msg) => (
          <ChatMessage key={msg.id} event={msg} />
        ))}
        {filteredMessages.length === 0 && (
          <p className="text-xs text-gray-500">No messages yet. Start the conversation!</p>
        )}
      </div>
      <form onSubmit={handleSend} className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Say something..."
          className="flex-grow mt-1 block w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 text-sm">
          Send
        </button>
      </form>
    </div>
  );
}