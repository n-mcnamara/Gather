import { LocateFixed } from 'lucide-react';

interface CenterMapControlProps {
  onRequestRecenter: () => void;
}

export default function CenterMapControl({ onRequestRecenter }: CenterMapControlProps) {
  return (
    <div className="leaflet-bottom leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button onClick={onRequestRecenter} title="Center on my location">
          <LocateFixed size={18} />
        </button>
      </div>
    </div>
  );
}