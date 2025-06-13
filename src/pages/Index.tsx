
import { useState } from "react";
import { ContentFeed } from "@/components/ContentFeed";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { Login } from "@/components/Login";
import { Settings } from "@/components/Settings";
import { useSpreadsheetConfig, SpreadsheetConfig } from "@/hooks/useSpreadsheetConfig";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { config } = useSpreadsheetConfig();

  // Content counts for filter bar
  const [contentCounts, setContentCounts] = useState({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const handleLogin = (user: string, password: string) => {
    setIsAuthenticated(true);
    setUsername(user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    console.log("Atualizando conteúdo da planilha...");
  };

  const handleSaveSettings = (newConfig: SpreadsheetConfig) => {
    console.log("Configuração da planilha salva:", newConfig);
    // Trigger refresh after saving settings
    setRefreshTrigger(prev => prev + 1);
  };

  const handleContentCountsChange = (counts: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
  }) => {
    setContentCounts(counts);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} logoUrl={config.logoUrl} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSettingsClick={() => setShowSettings(true)}
        onLogout={handleLogout}
        onRefresh={handleRefresh}
        username={username}
        logoUrl={config.logoUrl}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Aprovação de Conteúdo</h1>
            <p className="text-gray-600">Revise e aprove conteúdo para publicação</p>
            {config.columns.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Colunas configuradas:</strong> {config.columns.map(col => `${col.columnLetter} (${col.columnName})`).join(', ')}
                </p>
              </div>
            )}
          </div>
          
          <FilterBar 
            currentFilter={filter} 
            onFilterChange={setFilter}
            contentCounts={contentCounts}
          />
          <ContentFeed 
            filter={filter}
            refreshTrigger={refreshTrigger}
            onContentCountsChange={handleContentCountsChange}
          />
        </div>
      </main>

      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSaveSettings}
        currentConfig={config}
      />
    </div>
  );
};

export default Index;
