
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  currentFilter: 'all' | 'pending' | 'approved' | 'rejected';
  onFilterChange: (filter: 'all' | 'pending' | 'approved' | 'rejected') => void;
}

export const FilterBar = ({ currentFilter, onFilterChange }: FilterBarProps) => {
  const filters = [
    { key: 'all' as const, label: 'All Content', count: 12 },
    { key: 'pending' as const, label: 'Pending', count: 8 },
    { key: 'approved' as const, label: 'Approved', count: 3 },
    { key: 'rejected' as const, label: 'Rejected', count: 1 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.key}
            variant={currentFilter === filter.key ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.key)}
            className="flex items-center space-x-2"
          >
            <span>{filter.label}</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              currentFilter === filter.key 
                ? 'bg-white/20 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {filter.count}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};
