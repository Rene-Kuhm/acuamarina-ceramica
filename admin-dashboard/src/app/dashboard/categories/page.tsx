'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Loader2, Pencil, FolderOpen, Layers, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCategories, useCreateCategory, useDeleteCategory } from '@/hooks/useCategories';

export default function CategoriesPage() {
  const [newParentName, setNewParentName] = useState('');
  const [newChildByParent, setNewChildByParent] = useState<Record<string, string>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  // Filtrar categorías según el toggle de activo/inactivo
  const filteredCategories = categories?.filter(cat =>
    showInactive ? true : cat.isActive
  );

  // Calcular totales
  const totalParents = categories?.length || 0;
  const totalChildren = categories?.reduce((sum, cat) => sum + (cat.children?.length || 0), 0) || 0;
  const totalActive = categories?.filter(cat => cat.isActive).length || 0;
  const totalInactive = categories?.filter(cat => !cat.isActive).length || 0;

  const handleAddParent = () => {
    if (!newParentName.trim()) return;
    createCategory.mutate({ name: newParentName.trim() });
    setNewParentName('');
  };

  const handleAddSubcategory = (parentId: string) => {
    const childName = (newChildByParent[parentId] || '').trim();
    if (!childName) return;
    createCategory.mutate({ name: childName, parentId });
    setNewChildByParent((prev) => ({ ...prev, [parentId]: '' }));
  };

  const handleDeleteClick = (id: string, name: string) => {
    setItemToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    deleteCategory.mutate(itemToDelete.id);
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-orange-50/20">
      <div className="space-y-6 animate-fade-in p-6">
        <div className="flex items-center justify-between relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent rounded-lg blur-3xl"></div>
          <div className="relative">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FolderOpen className="h-6 w-6 text-amber-600" />
              Categorías
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Gestiona las categorías y subcategorías de tus productos
            </p>
          </div>
          <Button
            variant={showInactive ? "secondary" : "outline"}
            onClick={() => setShowInactive(!showInactive)}
            className="flex items-center gap-2"
          >
            {showInactive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {showInactive ? 'Mostrar todas' : 'Solo activas'}
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <FolderOpen className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalParents}</p>
                <p className="text-xs text-muted-foreground">Categorías Padre</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Layers className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalChildren}</p>
                <p className="text-xs text-muted-foreground">Subcategorías</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalActive}</p>
                <p className="text-xs text-muted-foreground">Activas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <EyeOff className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalInactive}</p>
                <p className="text-xs text-muted-foreground">Inactivas</p>
              </div>
            </CardContent>
          </Card>
        </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-amber-600" />
            Crear Nueva Categoría Padre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Nombre de la categoría padre"
              value={newParentName}
              onChange={(e) => setNewParentName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddParent()}
              className="flex-1"
              disabled={createCategory.isPending}
            />
            <Button onClick={handleAddParent} disabled={createCategory.isPending}>
              {createCategory.isPending && !newChildByParent[Object.keys(newChildByParent)[0]] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {!filteredCategories || filteredCategories.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                {showInactive ? 'No hay categorías aún.' : 'No hay categorías activas. Activa el filtro para ver todas.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCategories.map((parent) => (
            <Card key={parent.id} className={!parent.isActive ? 'opacity-60 border-dashed' : ''}>
              <CardHeader className="space-y-4 bg-gradient-to-r from-amber-50/50 to-transparent">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <FolderOpen className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {parent.name}
                        {!parent.isActive && (
                          <Badge variant="secondary" className="text-xs">
                            Inactiva
                          </Badge>
                        )}
                      </CardTitle>
                      {parent.description && (
                        <p className="text-sm text-muted-foreground mt-1">{parent.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={parent.isActive ? 'secondary' : 'outline'} className="bg-green-100 text-green-800 hover:bg-green-200">
                      {parent.isActive ? '✓ Activa' : '✗ Inactiva'}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Layers className="h-3 w-3 mr-1" />
                      {parent.children?.length || 0} subcategorías
                    </Badge>
                    <Link href={`/dashboard/categories/${parent.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4 text-blue-500 mr-2" />
                        Editar
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(parent.id, parent.name)}>
                      <Trash2 className="h-4 w-4 text-red-500 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {parent.children && parent.children.length > 0 && (
                  <div className="mb-3 space-y-2">
                    <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Layers className="h-4 w-4 text-blue-600" />
                      Subcategorías:
                    </p>
                    {parent.children.map((child) => (
                      <div key={child.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border ${child.isActive ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-8 bg-blue-400 rounded-full"></div>
                          <span className="text-base font-medium text-slate-900">{child.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={child.isActive ? 'secondary' : 'outline'} className={child.isActive ? 'bg-green-100 text-green-800' : ''}>
                            {child.isActive ? '✓ Activa' : '✗ Inactiva'}
                          </Badge>
                          <Link href={`/dashboard/categories/${child.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4 text-blue-500 mr-2" />
                              Editar
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(child.id, child.name)}>
                            <Trash2 className="h-4 w-4 text-red-500 mr-2" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 pt-2 border-t border-slate-200">
                  <Input
                    placeholder="Añadir subcategoría..."
                    value={newChildByParent[parent.id] || ''}
                    onChange={(e) => setNewChildByParent((prev) => ({ ...prev, [parent.id]: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSubcategory(parent.id)}
                    disabled={createCategory.isPending}
                    className="flex-1"
                  />
                  <Button onClick={() => handleAddSubcategory(parent.id)} disabled={createCategory.isPending} size="sm">
                    {createCategory.isPending && newChildByParent[parent.id] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                    Agregar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la categoría{' '}
              <span className="font-semibold text-slate-900">"{itemToDelete?.name}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700" disabled={deleteCategory.isPending}>
              {deleteCategory.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </div>
  );
}
