
import { useState } from "react";
import { ContentFeed } from "@/components/ContentFeed";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { Login } from "@/components/Login";
import { Settings, SpreadsheetConfig } from "@/components/Settings";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [spreadsheetConfig, setSpreadsheetConfig] = useState<SpreadsheetConfig>({
    spreadsheetUrl: "",
    evaluationTab: "Avaliação",
    approvedTab: "Aprovado", 
    rejectedTab: "Rejeitado",
    logoUrl: "",
  });

  const handleLogin = (user: string, password: string) => {
    setIsAuthenticated(true);
    setUsername(user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
  };

  const handleSaveSettings = (config: SpreadsheetConfig) => {
    setSpreadsheetConfig(config);
    console.log("Configuração da planilha salva:", config);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} logoUrl={spreadsheetConfig.logoUrl} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSettingsClick={() => setShowSettings(true)}
        onLogout={handleLogout}
        username={username}
        logoUrl={spreadsheetConfig.logoUrl}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Aprovação de Conteúdo</h1>
            <p className="text-gray-600">Revise e aprove conteúdo para publicação</p>
          </div>
          
          <FilterBar currentFilter={filter} onFilterChange={setFilter} />
          <ContentFeed filter={filter} />
        </div>
      </main>

      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSaveSettings}
        currentConfig={spreadsheetConfig}
      />
    </div>
  );
};

export default Index;
