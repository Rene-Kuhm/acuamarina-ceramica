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
    email: 'admin@aguamarina.com',
    password: 'Admin123!',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('🔐 Intentando login...', formData.email);
      const response = await authService.login(formData);
      console.log('✅ Login exitoso:', response);

      // Llamar a login del store
      login(response.user, response.accessToken, response.refreshToken);
      console.log('✅ Tokens guardados en store');

      // Esperar un poco para asegurar que el estado se actualice
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('❌ Error en login:', err);
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#14b8a6] via-[#0d9488] to-[#115e59] p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        {/* Logo and Title */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center shadow-lg">
              <Image
                src="/logo/logo.png"
                alt="Aguamarina Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Aguamarina Mosaicos</h1>
              <p className="text-white/80 text-sm">Panel de Administración</p>
            </div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Gestiona tu negocio<br />con elegancia
          </h2>
          <p className="text-white/90 text-lg max-w-md">
            Sistema integral para administrar productos, categorías, pedidos y clientes de forma profesional.
          </p>

          {/* Features */}
          <div className="space-y-4 pt-6">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Seguro y Confiable</h3>
                <p className="text-white/70 text-sm">Autenticación JWT con tokens de refresco</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Interfaz Moderna</h3>
                <p className="text-white/70 text-sm">Diseño responsivo y fácil de usar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-white/60 text-sm">
          © 2025 Aguamarina Mosaicos. Todos los derechos reservados.
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-[#14b8a6] flex items-center justify-center shadow-lg">
              <Image
                src="/logo/logo.png"
                alt="Aguamarina Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
          </div>

          <Card className="border-slate-200 bg-white shadow-xl">
            <CardHeader className="space-y-2 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f0fdfa] border border-[#ccfbf1] text-[#14b8a6] text-xs font-semibold w-fit">
                <Sparkles className="h-3.5 w-3.5" />
                Sistema Premium
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">
                Iniciar Sesión
              </CardTitle>
              <CardDescription className="text-slate-600">
                Ingresa tus credenciales para acceder al panel
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#14b8a6]" />
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@aguamarina.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                    className="h-11"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-[#14b8a6]" />
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                    className="h-11"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
                    <ShieldCheck className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isLoading}
                  className="mt-6"
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
              <div className="pt-4 border-t border-slate-200">
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 font-medium text-center">Credenciales de prueba</p>
                  <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Email:</span>
                      <span className="text-[#14b8a6] font-mono font-semibold">admin@aguamarina.com</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Password:</span>
                      <span className="text-[#14b8a6] font-mono font-semibold">Admin123!</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              ¿Problemas para acceder?{' '}
              <button className="text-[#14b8a6] font-semibold hover:underline">
                Contacta soporte
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
