import { useEffect, useState, useMemo } from 'react';
import { useNDK } from '../context/NostrProvider';
import { NDKEvent } from '@nostr-dev-kit/ndk';

export function useEventChat(event: NDKEvent) {
  const { ndk, user } = useNDK();
  const [messages, setMessages] = useState<Map<string, NDKEvent>>(new Map());

  const eventId = event.tagValue('d');
  const eventCoordinate = `${event.kind}:${event.pubkey}:${eventId}`;

  useEffect(() => {
    if (!eventId) return;

    const sub = ndk.subscribe(
      {
        kinds: [1],
        '#a': [eventCoordinate],
      },
      { closeOnEose: false }
    );

    sub.on('event', (chatEvent: NDKEvent) => {
      setMessages((prev) => {
        const newMap = new Map(prev);
        newMap.set(chatEvent.id, chatEvent);
        return newMap;
      });
    });

    return () => sub.stop();
  }, [ndk, eventCoordinate]);

  const sendMessage = async (content: string) => {
    if (!user) {
      alert('Please log in to chat.');
      return;
    }

    const chatEvent = new NDKEvent(ndk);
    chatEvent.kind = 1;
    chatEvent.content = content;
    chatEvent.tags = [['a', eventCoordinate, 'root']];

    await chatEvent.publish();
  };

  const sortedMessages = useMemo(() => {
    return Array.from(messages.values()).sort(
      (a, b) => (a.created_at || 0) - (b.created_at || 0)
    );
  }, [messages]);

  return { messages: sortedMessages, sendMessage };
}
