'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { User, Lock, Bell, Palette } from 'lucide-react';

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">Gestiona tu cuenta y preferencias</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Perfil de Usuario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
            <CardDescription>Detalles de tu cuenta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nombre</Label>
              <Input
                value={`${user?.firstName || ''} ${user?.lastName || ''}`}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={user?.email || ''}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label>Rol</Label>
              <Input
                value={user?.role || ''}
                disabled
                className="mt-1 capitalize"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Para actualizar tu información personal, contacta al administrador del sistema.
            </p>
          </CardContent>
        </Card>

        {/* Cambiar Contraseña */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Cambiar Contraseña
            </CardTitle>
            <CardDescription>Actualiza tu contraseña de acceso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  disabled
                  placeholder="••••••••"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  disabled
                  placeholder="••••••••"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  disabled
                  placeholder="••••••••"
                  className="mt-1"
                />
              </div>
              <Button type="button" disabled className="w-full">
                Próximamente
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Esta funcionalidad estará disponible próximamente
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
            <CardDescription>Configura tus preferencias de notificaciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Pedidos nuevos</p>
                <p className="text-sm text-muted-foreground">
                  Recibe notificaciones de pedidos nuevos
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                disabled
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Stock bajo</p>
                <p className="text-sm text-muted-foreground">
                  Alertas cuando el stock es bajo
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                disabled
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Nuevos clientes</p>
                <p className="text-sm text-muted-foreground">
                  Notificación de registros nuevos
                </p>
              </div>
              <input
                type="checkbox"
                disabled
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
            <Button
              variant="outline"
              className="w-full"
              disabled
            >
              Próximamente
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Esta funcionalidad estará disponible próximamente
            </p>
          </CardContent>
        </Card>

        {/* Apariencia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Apariencia
            </CardTitle>
            <CardDescription>Personaliza la interfaz del dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Tema</Label>
              <select disabled className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
                <option value="system">Sistema</option>
              </select>
            </div>
            <div>
              <Label>Idioma</Label>
              <select disabled className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
            <Button
              variant="outline"
              className="w-full"
              disabled
            >
              Próximamente
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Esta funcionalidad estará disponible próximamente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Información del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Versión</p>
              <p className="font-medium">1.0.0</p>
            </div>
            <div>
              <p className="text-muted-foreground">Entorno</p>
              <p className="font-medium">Desarrollo</p>
            </div>
            <div>
              <p className="text-muted-foreground">Backend</p>
              <p className="font-medium">Conectado</p>
            </div>
            <div>
              <p className="text-muted-foreground">Base de Datos</p>
              <p className="font-medium">PostgreSQL</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
