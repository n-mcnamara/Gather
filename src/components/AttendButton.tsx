import React from 'react';
import { useAttendEvent } from '../hooks/useAttendance';
import { useUnattendEvent } from '../hooks/useUnattendEvent';
import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNDK } from '../context/NostrProvider';
import { useEventAttendance } from '../hooks/useEventAttendance';

export default function AttendButton({ event }: { event: NDKEvent }) {
  const { user } = useNDK();
  const attend = useAttendEvent();
  const unattend = useUnattendEvent();
  const attendees = useEventAttendance(event);

  if (!user) {
    // Don't show the button if the user isn't logged in
    return null;
  }

  const isAttending = attendees.has(user.pubkey);

  const handleToggleAttendance = () => {
    if (isAttending) {
      unattend(event);
    } else {
      attend(event);
    }
  };

  const baseClasses = "mr-2 p-2 text-white rounded text-sm";
  const attendClasses = "bg-blue-600 hover:bg-blue-700";
  const unattendClasses = "bg-gray-500 hover:bg-gray-600";

  return (
    <button 
      className={`${baseClasses} ${isAttending ? unattendClasses : attendClasses}`} 
      onClick={handleToggleAttendance}
    >
      {isAttending ? 'Un-attend' : '👥 Attend'}
    </button>
  );
}