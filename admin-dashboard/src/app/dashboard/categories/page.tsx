'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Loader2 } from 'lucide-react';
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

  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

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
            <h1 className="text-2xl font-bold text-slate-900">
              Categorías
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Gestiona las categorías y subcategorías de tus productos.
            </p>
          </div>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Crear Nueva Categoría Padre</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Nombre de la categoría padre"
              value={newParentName}
              onChange={(e) => setNewParentName(e.target.value)}
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
        {!categories || categories.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No hay categorías aún.</p>
        ) : (
          categories.map((parent) => (
            <Card key={parent.id}>
              <CardHeader className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <CardTitle className="text-xl">{parent.name}</CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={parent.isActive ? 'default' : 'secondary'}>
                      {parent.isActive ? 'Activa' : 'Inactiva'}
                    </Badge>
                    <Badge variant="outline">{parent.children.length} subcategorías</Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(parent.id, parent.name)}>
                      <Trash2 className="h-4 w-4 text-red-500 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {parent.children.map((child) => (
                  <div key={child.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-base font-medium text-slate-900">{child.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={child.isActive ? 'default' : 'secondary'}>
                        {child.isActive ? 'Activa' : 'Inactiva'}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(child.id, child.name)}>
                        <Trash2 className="h-4 w-4 text-red-500 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <Input
                    placeholder="Añadir subcategoría..."
                    value={newChildByParent[parent.id] || ''}
                    onChange={(e) => setNewChildByParent((prev) => ({ ...prev, [parent.id]: e.target.value }))}
                    disabled={createCategory.isPending}
                  />
                  <Button onClick={() => handleAddSubcategory(parent.id)} disabled={createCategory.isPending}>
                    {createCategory.isPending && newChildByParent[parent.id] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Agregar'}
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
