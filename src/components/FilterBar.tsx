
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  currentFilter: 'all' | 'pending' | 'approved' | 'rejected';
  onFilterChange: (filter: 'all' | 'pending' | 'approved' | 'rejected') => void;
  contentCounts: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export const FilterBar = ({ currentFilter, onFilterChange, contentCounts }: FilterBarProps) => {
  const filters = [
    { key: 'all' as const, label: 'Todo Conteúdo', count: contentCounts.all },
    { key: 'pending' as const, label: 'Pendente', count: contentCounts.pending },
    { key: 'approved' as const, label: 'Aprovado', count: contentCounts.approved },
    { key: 'rejected' as const, label: 'Rejeitado', count: contentCounts.rejected },
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
