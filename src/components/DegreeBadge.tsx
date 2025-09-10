import React, { useState } from 'react';

interface DegreeBadgeProps {
  degree: 1 | 2 | '?' | number;
  onDeepSearch: () => Promise<number | null>;
}

export default function DegreeBadge({ degree: initialDegree, onDeepSearch }: DegreeBadgeProps) {
  const [degree, setDegree] = useState(initialDegree);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    const foundDegree = await onDeepSearch();
    setDegree(foundDegree || 'Not found');
    setIsSearching(false);
  };

  const baseClasses = "px-2 py-0.5 text-xs font-semibold rounded-full";
  let colorClasses = "bg-gray-200 text-gray-800";
  let content: React.ReactNode = degree;

  if (degree === 1) {
    colorClasses = "bg-green-100 text-green-800";
    content = "1st";
  } else if (degree === 2) {
    colorClasses = "bg-blue-100 text-blue-800";
    content = "2nd";
  } else if (degree === '?') {
    return (
      <button onClick={handleSearch} className={`${baseClasses} ${colorClasses} hover:bg-gray-300`}>
        {isSearching ? '...' : '?'}
      </button>
    );
  } else if (typeof degree === 'number') {
    colorClasses = "bg-purple-100 text-purple-800";
    content = `${degree}th`;
  }

  return (
    <span className={`${baseClasses} ${colorClasses}`}>
      {content}
    </span>
  );
}
