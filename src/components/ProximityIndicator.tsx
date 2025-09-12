import { useMemo } from 'react';
import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useProximity } from '../hooks/useProximity';
import { useNostrEvents } from '../hooks/useNostrEvents';

export default function ProximityIndicator({ event }: { event: NDKEvent }) {
  const { canCheckIn, isCheckedIn, checkIn, distance } = useProximity(event);

  const filter = useMemo(() => {
    const dTag = event.tagValue('d');
    if (!dTag) return null;
    return {
      kinds: [40001],
      '#a': [`${event.kind}:${event.pubkey}:${dTag}`],
    };
  }, [event]);

  const checkInPings = useNostrEvents(filter || {});

  // Use a Set to count unique authors, not total events
  const uniqueCheckIns = useMemo(() => {
    const pubkeys = new Set<string>();
    for (const ping of checkInPings) {
      pubkeys.add(ping.pubkey);
    }
    return pubkeys;
  }, [checkInPings]);

  const formatDistance = (d: number | null) => {
    if (d === null) return 'Calculating distance...';
    if (d > 1000) return `You are ${(d / 1000).toFixed(1)}km away.`;
    return `You are ${d.toFixed(0)}m away.`;
  };

  return (
    <div className="p-4 border rounded-lg mt-4">
      <h3 className="font-bold text-lg mb-2">Live Proximity</h3>
      <div className="flex items-center space-x-4">
        <div>
          <span className="text-2xl font-bold">{uniqueCheckIns.size}</span>
          <span className="text-gray-600"> users here now</span>
        </div>
        {canCheckIn && (
          <button
            onClick={checkIn}
            disabled={isCheckedIn}
            className={`px-4 py-2 text-white rounded-lg shadow-md text-sm ${
              isCheckedIn ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isCheckedIn ? 'Checked In' : 'Check In'}
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {formatDistance(distance)}
      </p>
    </div>
  );
}