import React, { useState } from 'react';
import MapView from './components/MapView';
import { LoginButton } from './components/LoginButton';
import TimeFilter from './components/TimeFilter';
import { type TimeFilterValue, type MapFilter } from './types';
import CommunitiesView from './components/CommunitiesView';
import { Map, Users, Globe, Users2 } from 'lucide-react';
import { LatLng } from 'leaflet';
import CreateEventModal from './components/CreateEventModal';
import { useNDK } from './context/NostrProvider';
import { useMyCommunities } from './hooks/useMyCommunities';

type View = 'map' | 'communities';

export default function AppContent() {
  const [timeFilter, setTimeFilter] = useState<TimeFilterValue>('live');
  const [view, setView] = useState<View>('map');
  const [mapFilter, setMapFilter] = useState<MapFilter>('public');
  const [newEventPos, setNewEventPos] = useState<LatLng | null>(null);
  const { user, login } = useNDK();
  const { communities: myCommunities } = useMyCommunities();

  const handleLaunchCreateEvent = (latlng: LatLng) => {
    if (!user) {
      login();
    } else {
      setNewEventPos(latlng);
    }
  };

  const handleCloseCreateModal = () => {
    setNewEventPos(null);
  };

  return (
    <div className="relative w-screen h-screen">
      <div className="absolute top-4 left-4 z-50 flex flex-col space-y-2">
        <LoginButton />
        {view === 'map' && (
          <>
            <TimeFilter filter={timeFilter} onFilterChange={setTimeFilter} />
            <button onClick={() => setMapFilter(f => f === 'public' ? 'communities' : 'public')} className="p-2 bg-white rounded-md shadow-md hover:bg-gray-100 flex items-center space-x-2">
              {mapFilter === 'public' ? <Globe size={18} /> : <Users2 size={18} />}
              <span className="text-sm">{mapFilter === 'public' ? 'Public' : 'My Communities'}</span>
            </button>
          </>
        )}
      </div>

      <div className="absolute top-4 right-4 z-50">
        <button onClick={() => setView(v => v === 'map' ? 'communities' : 'map')} className="p-2 bg-white rounded-md shadow-md hover:bg-gray-100">
          {view === 'map' ? <Users /> : <Map />}
        </button>
      </div>

      {view === 'map' ? (
        <MapView 
          timeFilter={timeFilter} 
          mapFilter={mapFilter} 
          onLaunchCreateEvent={handleLaunchCreateEvent} 
        />
      ) : (
        <CommunitiesView />
      )}

      {newEventPos && (
        <CreateEventModal 
          isOpen={!!newEventPos}
          onClose={handleCloseCreateModal}
          lat={newEventPos.lat}
          lon={newEventPos.lng}
          communities={myCommunities}
        />
      )}
    </div>
  );
}