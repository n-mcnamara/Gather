import { NDKEvent } from '@nostr-dev-kit/ndk';
import AttendeeList from './AttendeeList';
import EventChat from './EventChat';
import AttendButton from './AttendButton';
import ZapButton from './ZapButton';
import { useEventAttendance } from '../hooks/useEventAttendance';
import ProximityIndicator from './ProximityIndicator';

const formatTime = (timestamp: string | undefined): string => {
  if (!timestamp) return '';
  return new Date(parseInt(timestamp) * 1000).toLocaleString([], {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

export default function EventDetails({ event }: { event: NDKEvent }) {
  const title = event.tagValue('title');
  const summary = event.tagValue('summary');
  const starts = event.tagValue('starts');
  const ends = event.tagValue('ends');
  const attendees = Array.from(useEventAttendance(event));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{title || 'Event'}</h2>
      <p className="text-gray-600 mb-4">{summary || event.content}</p>
      
      {starts && ends && (
        <div className="text-md text-gray-800 my-4">
          <p><strong>Starts:</strong> {formatTime(starts)}</p>
          <p><strong>Ends:</strong> {formatTime(ends)}</p>
        </div>
      )}

      <ProximityIndicator event={event} />

      <div className="flex items-center my-4">
        <AttendButton event={event} />
        <ZapButton event={event} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <AttendeeList pubkeys={attendees} creatorPubkey={event.pubkey} />
        </div>
        <div>
          <EventChat event={event} />
        </div>
      </div>
    </div>
  );
}