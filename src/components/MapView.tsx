import { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import EventMarker from './EventMarker';
import { useNostrEvents } from '../hooks/useNostrEvents';
import { LatLng } from 'leaflet';
import { type TimeFilterValue, type MapFilter } from '../types';
import { useGeolocation } from '../hooks/useGeolocation';
import Modal from './Modal';
import EventDetails from './EventDetails';
import { NDKEvent } from '@nostr-dev-kit/ndk';
import MapController from './MapController';
import { greenIcon } from '../utils/icons';
import { useNDK } from '../context/NostrProvider';
import UserMarker from './UserMarker';

function MapClickHandler({ onMapClick }: { onMapClick: (latlng: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

interface MapViewProps {
  timeFilter: TimeFilterValue;
  mapFilter: MapFilter;
  onLaunchCreateEvent: (latlng: LatLng) => void;
  communities: NDKEvent[];
}

export default function MapView({ timeFilter, mapFilter, onLaunchCreateEvent, communities }: MapViewProps) {
  const { user, login } = useNDK();
  
  const filter = useMemo(() => {
    if (mapFilter === 'communities') {
      const communityPointers = communities.map(c => {
        const dTag = c.tags.find(t => t[0] === 'd' && t[1] !== 'gather-community');
        if (!dTag) return null;
        return `30023:${c.pubkey}:${dTag[1]}`;
      }).filter(Boolean);

      if (communityPointers.length === 0) {
        return { kinds: [31923], '#a': ['no-communities'] };
      }
      return { kinds: [31923], '#a': communityPointers as string[] };
    } else {
      return { kinds: [31923], "#t": ["gather"] };
    }
  }, [mapFilter, communities]);

  const events = useNostrEvents(filter);
  const { coordinates } = useGeolocation();
  const [selectedEvent, setSelectedEvent] = useState<NDKEvent | null>(null);
  const [newEventPos, setNewEventPos] = useState<LatLng | null>(null);

  useEffect(() => {
    // This useEffect ensures the component re-renders when the events array changes.
  }, [events]);

  const handleMapClick = (latlng: LatLng) => {
    if (!user) {
      login();
    } else {
      setNewEventPos(latlng);
    }
  };

  const handleDetailsClick = (event: NDKEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const now = Math.floor(Date.now() / 1000);

  const visibleEvents = events.filter(ev => {
    const expiresAt = ev.tagValue('expires_at');
    if (!expiresAt || parseInt(expiresAt) <= now) return false;
    const startsAt = ev.tagValue('starts');
    if (!startsAt) return false;
    const sixHoursFromNow = now + (6 * 60 * 60);
    if (timeFilter === 'live') return parseInt(startsAt) < sixHoursFromNow;
    if (timeFilter === 'upcoming') return parseInt(startsAt) >= sixHoursFromNow;
    return true;
  });

  const initialCenter: [number, number] = [32.65, -16.90];
  const userCenter: [number, number] | null = coordinates ? [coordinates.lat, coordinates.lng] : null;

  return (
    <>
      <MapContainer center={initialCenter} zoom={13} className="w-full h-full z-0" zoomControl={false}>
        <MapController center={userCenter} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <MapClickHandler onMapClick={handleMapClick} />
        <UserMarker />

        {visibleEvents.map((ev) => (
          <EventMarker key={ev.id} event={ev} onDetailsClick={handleDetailsClick} />
        ))}

        {newEventPos && (
          <Marker position={newEventPos} icon={greenIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold">Create event here?</p>
                <button 
                  onClick={() => {
                    onLaunchCreateEvent(newEventPos);
                    setNewEventPos(null);
                  }}
                  className="mt-2 w-full text-center px-3 py-1.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 text-sm"
                >
                  Confirm
                </button>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <Modal isOpen={!!selectedEvent} onClose={handleCloseModal}>
        {selectedEvent && <EventDetails event={selectedEvent} />}
      </Modal>
    </>
  );
}
