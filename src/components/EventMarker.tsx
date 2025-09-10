import React, { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useEventAttendance } from '../hooks/useEventAttendance';
import { useCommunityName } from '../hooks/useCommunityName';
import { Globe, Users } from 'lucide-react';
import { parseGeo } from '../utils/geo';

const CommunityBadge = ({ event }: { event: NDKEvent }) => {
  const communityTag = event.tags.find(t => t[0] === 'a' && t[1].startsWith('30023:'));
  const communityName = useCommunityName(communityTag?.[1]);

  const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full inline-flex items-center space-x-1";
  
  if (communityName) {
    return (
      <span className={`${baseClasses} bg-purple-100 text-purple-800`}>
        <Users size={12} />
        <span>{communityName}</span>
      </span>
    );
  }

  return (
    <span className={`${baseClasses} bg-gray-200 text-gray-800`}>
      <Globe size={12} />
      <span>Public</span>
    </span>
  );
};

interface EventMarkerProps {
  event: NDKEvent;
  onDetailsClick: (event: NDKEvent) => void;
}

export default function EventMarker({ event, onDetailsClick }: EventMarkerProps) {
  const geoTag = event.tagValue('g');
  const attendees = useEventAttendance(event);

  if (attendees.size === 0) {
    return null;
  }

  if (!geoTag) return null;

  const coords = parseGeo(geoTag);
  if (!coords) {
    return null;
  }

  const title = event.tagValue('title');
  const summary = event.tagValue('summary');

  return (
    <Marker position={[coords.lat, coords.lon]}>
      <Popup>
        <div className="min-w-[200px]">
          <div className="mb-2">
            <CommunityBadge event={event} />
          </div>
          <strong>{title || 'Event'}</strong>
          <p className="text-sm text-gray-600">{summary || event.content}</p>
          <div className="mt-2">
            <span className="text-sm font-semibold">{attendees.size}</span>
            <span className="text-sm text-gray-600"> going</span>
          </div>
          <button 
            onClick={() => onDetailsClick(event)}
            className="mt-2 w-full text-center px-3 py-1.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 text-sm"
          >
            Details
          </button>
        </div>
      </Popup>
    </Marker>
  );
}
