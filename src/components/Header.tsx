
import { Bell, User, Settings as SettingsIcon, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onSettingsClick: () => void;
  onLogout: () => void;
  onRefresh: () => void;
  username: string;
  logoUrl?: string;
}

export const Header = ({ onSettingsClick, onLogout, onRefresh, username, logoUrl }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Logo da empresa" 
                className="h-8 w-auto object-contain"
              />
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CA</span>
              </div>
            )}
            <h2 className="text-xl font-semibold text-gray-900">Aprovação de Conteúdo</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Olá, {username}</span>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </Button>
            <Button variant="ghost" size="sm" onClick={onRefresh} title="Atualizar conteúdo">
              <RefreshCw className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onSettingsClick}>
              <SettingsIcon className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
