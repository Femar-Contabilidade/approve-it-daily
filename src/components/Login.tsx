import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

interface LoginProps {
  onLogin: (username: string, password: string) => void;
  logoUrl?: string;
}

export const Login = ({ onLogin, logoUrl }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha usuário e senha.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    try {
      // Chama a Edge Function criada
      const res = await fetch("/functions/v1/login-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        onLogin(username, password);
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao sistema de aprovação de conteúdo!",
        });
      } else {
        toast({
          title: "Erro de login",
          description: data.error || "Usuário ou senha incorretos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro de login",
        description: "Erro inesperado ao tentar autenticar.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Logo da empresa" 
              className="h-16 w-auto object-contain mx-auto mb-4"
            />
          ) : (
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">CA</span>
            </div>
          )}
          <CardTitle className="text-2xl">Aprovação de Conteúdo</CardTitle>
          <CardDescription>
            Faça login para acessar o sistema de aprovação
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* BLOCO TEMPORÁRIO COM CREDENCIAL ADMIN */}
          <div className="mb-6 p-3 bg-yellow-100 border border-yellow-300 rounded text-yellow-900 text-sm font-semibold">
            <span className="block mb-1 text-yellow-800 font-bold">
              ⚠️ Acesso temporário de administrador:
            </span>
            <div>
              <span className="font-bold">Login:</span> <span className="font-mono">admin_temp</span>
            </div>
            <div>
              <span className="font-bold">Senha:</span> <span className="font-mono">senha</span>
            </div>
            <div className="mt-1 text-xs text-yellow-700">
              (Remova esse bloco após uso!)
            </div>
          </div>
          {/* FIM BLOCO TEMPORÁRIO */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
