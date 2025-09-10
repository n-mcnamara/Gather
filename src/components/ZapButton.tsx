import React from 'react';

export default function ZapButton({ event }: { event: any }) {
  const handleZap = () => {
    alert(`Zap button clicked for event ${event.id}`);
  };

  return <button className="p-1 bg-yellow-500 text-white rounded" onClick={handleZap}>⚡ Zap</button>;
}