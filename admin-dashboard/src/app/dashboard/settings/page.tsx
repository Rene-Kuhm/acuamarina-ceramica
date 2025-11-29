'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { User, Lock, Bell, Palette, Save, AlertCircle } from 'lucide-react';
import { userService } from '@/services/user.service';
import { toast } from 'sonner';

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  // Estado para cambio de contraseña
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Estado para perfil
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsChangingPassword(true);
    try {
      await userService.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success('Contraseña actualizada exitosamente');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileForm.name.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const response = await userService.updateProfile({
        name: profileForm.name,
        phone: profileForm.phone || undefined,
      });

      updateUser(response.data);
      toast.success('Perfil actualizado exitosamente');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

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
            <CardDescription>Actualiza los detalles de tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="mt-1"
                  placeholder="Tu nombre completo"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="mt-1 bg-gray-50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  El email no se puede modificar
                </p>
              </div>
              <div>
                <Label htmlFor="phone">Teléfono (opcional)</Label>
                <Input
                  id="phone"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="mt-1"
                  placeholder="+54 11 1234-5678"
                />
              </div>
              <div>
                <Label>Rol</Label>
                <Input
                  value={user?.role || ''}
                  disabled
                  className="mt-1 capitalize bg-gray-50"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isUpdatingProfile}
              >
                <Save className="h-4 w-4 mr-2" />
                {isUpdatingProfile ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </form>
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
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="mt-1"
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Mínimo 6 caracteres
                </p>
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="mt-1"
                  required
                />
              </div>
              {passwordForm.newPassword && passwordForm.confirmPassword &&
               passwordForm.newPassword !== passwordForm.confirmPassword && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  Las contraseñas no coinciden
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={isChangingPassword ||
                         !passwordForm.currentPassword ||
                         !passwordForm.newPassword ||
                         passwordForm.newPassword !== passwordForm.confirmPassword}
              >
                <Lock className="h-4 w-4 mr-2" />
                {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
              </Button>
            </form>
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
              <p className="font-medium">Producción</p>
            </div>
            <div>
              <p className="text-muted-foreground">Backend</p>
              <p className="font-medium text-green-600">● Conectado</p>
            </div>
            <div>
              <p className="text-muted-foreground">Base de Datos</p>
              <p className="font-medium">PostgreSQL (Neon)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
