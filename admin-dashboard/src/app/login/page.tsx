'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: 'admin@acuamarina.com',
    password: 'Admin123!',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login(formData);
      login(response.user, response.accessToken, response.refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo Badge */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-2xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
            <div className="relative h-24 w-24 rounded-full bg-white flex items-center justify-center shadow-2xl ring-4 ring-white/10 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
              <Image
                src="/logo/logo.png"
                alt="Aguamarina Mosaicos Logo"
                width={96}
                height={96}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        <Card className="border-slate-700/50 bg-slate-900/90 backdrop-blur-xl shadow-2xl animate-slide-in">
          <CardHeader className="space-y-3 text-center pb-8">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                Sistema Premium
              </span>
            </div>
            <CardTitle className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Aguamarina Mosaicos
              </span>
            </CardTitle>
            <CardDescription className="text-slate-400 text-base">
              Panel de Administración Empresarial
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-cyan-400" />
                  Email
                </Label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@acuamarina.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                    className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 h-12 px-4 group-hover:border-cyan-500/30 transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4 text-cyan-400" />
                  Contraseña
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                    className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 h-12 px-4 group-hover:border-cyan-500/30 transition-colors"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 text-sm text-red-300 bg-red-500/10 rounded-xl border border-red-500/20 flex items-start gap-3 animate-fade-in">
                  <ShieldCheck className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 group relative overflow-hidden"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Iniciando sesión...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Iniciar Sesión
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="pt-4 border-t border-slate-700/50">
              <div className="text-center space-y-2">
                <p className="text-xs text-slate-400 font-medium">Credenciales de prueba</p>
                <div className="inline-flex flex-col gap-1 px-4 py-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <p className="text-xs text-cyan-400 font-mono">admin@aguamarina.com</p>
                  <p className="text-xs text-slate-400">•••••••</p>
                  <p className="text-xs text-cyan-400 font-mono">Admin123!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Badge */}
        <div className="mt-8 text-center animate-fade-in">
          <p className="text-sm text-slate-400">
            Protegido con{' '}
            <span className="text-cyan-400 font-semibold">autenticación JWT</span>
          </p>
        </div>
      </div>
    </div>
  );
}
