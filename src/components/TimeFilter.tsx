
type TimeFilterValue = 'live' | 'upcoming';

interface TimeFilterProps {
  filter: TimeFilterValue;
  onFilterChange: (filter: TimeFilterValue) => void;
}

export default function TimeFilter({ filter, onFilterChange }: TimeFilterProps) {
  const baseClasses = "px-4 py-2 text-sm font-medium";
  const activeClasses = "bg-blue-600 text-white";
  const inactiveClasses = "bg-white text-gray-700 hover:bg-gray-50";

  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <button
        type="button"
        className={`${baseClasses} rounded-l-lg border border-gray-200 ${filter === 'live' ? activeClasses : inactiveClasses}`}
        onClick={() => onFilterChange('live')}
      >
        Live Now
      </button>
      <button
        type="button"
        className={`${baseClasses} rounded-r-md border-t border-b border-r border-gray-200 ${filter === 'upcoming' ? activeClasses : inactiveClasses}`}
        onClick={() => onFilterChange('upcoming')}
      >
        Upcoming
      </button>
    </div>
  );
}
