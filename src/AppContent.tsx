import { useState } from 'react';
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
  const [recenterRequest, setRecenterRequest] = useState(0);

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

  const handleFilterToggle = () => {
    setMapFilter(currentFilter => {
      const nextFilter = currentFilter === 'public' ? 'communities' : 'public';
      if (nextFilter === 'communities' && myCommunities.length === 0) {
        alert("You haven't joined any communities yet. Go to the Communities tab to find some!");
        return 'public';
      }
      return nextFilter;
    });
  };

  return (
    <div className="relative w-screen h-screen">
      <div className="absolute top-4 left-4 z-50 flex flex-col space-y-2 safe-area-padding-top">
        {view === 'map' && (
          <>
            <LoginButton />
            <TimeFilter filter={timeFilter} onFilterChange={setTimeFilter} />
            <button onClick={handleFilterToggle} className="p-2 bg-white rounded-md shadow-md hover:bg-gray-100 flex items-center space-x-2">
              {mapFilter === 'public' ? <Globe size={18} /> : <Users2 size={18} />}
              <span className="text-sm">{mapFilter === 'public' ? 'Public' : 'My Communities'}</span>
            </button>
          </>
        )}
      </div>

      <div className="absolute top-4 right-4 z-50 safe-area-padding-top">
        <button onClick={() => setView(v => v === 'map' ? 'communities' : 'map')} className="p-2 bg-white rounded-md shadow-md hover:bg-gray-100">
          {view === 'map' ? <Users /> : <Map />}
        </button>
      </div>

      {view === 'map' ? (
        <MapView 
          timeFilter={timeFilter} 
          mapFilter={mapFilter} 
          onLaunchCreateEvent={handleLaunchCreateEvent}
          communities={myCommunities}
          recenterRequest={recenterRequest}
          onRequestRecenter={() => setRecenterRequest(c => c + 1)}
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