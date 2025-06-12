
import { useState } from "react";
import { ContentFeed } from "@/components/ContentFeed";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";

const Index = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Approval Dashboard</h1>
            <p className="text-gray-600">Review and approve content for publication</p>
          </div>
          
          <FilterBar currentFilter={filter} onFilterChange={setFilter} />
          <ContentFeed filter={filter} />
        </div>
      </main>
    </div>
  );
};

export default Index;
