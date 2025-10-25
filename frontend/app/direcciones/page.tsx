"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Edit, Trash2, Star, Home, Briefcase, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useAuth } from "@/lib/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressesApi, type Address } from "@/lib/api/addresses";
import { Skeleton } from "@/components/ui/skeleton";
import { AddressDialog } from "@/components/direcciones/AddressDialog";
import { toast } from "sonner";

export default function DireccionesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const { data: addresses, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressesApi.getAll(),
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: addressesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Dirección eliminada correctamente");
    },
    onError: () => {
      toast.error("Error al eliminar la dirección");
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: addressesApi.setDefault,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Dirección predeterminada actualizada");
    },
    onError: () => {
      toast.error("Error al establecer dirección predeterminada");
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login?redirect=/direcciones");
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Mi Cuenta", href: "/cuenta" },
    { label: "Mis Direcciones" },
  ];

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta dirección?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSetDefault = async (id: string) => {
    setDefaultMutation.mutate(id);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingAddress(null);
  };

  const getLabelIcon = (label?: string) => {
    if (!label) return <MapPin className="w-4 h-4" />;
    const lower = label.toLowerCase();
    if (lower.includes("casa") || lower.includes("home")) return <Home className="w-4 h-4" />;
    if (lower.includes("trabajo") || lower.includes("work") || lower.includes("oficina")) return <Briefcase className="w-4 h-4" />;
    return <Building className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <MapPin className="w-8 h-8 text-primary" />
                Mis Direcciones
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona tus direcciones de envío
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingAddress(null);
                setIsDialogOpen(true);
              }}
              className="bg-primary hover:bg-primary-hover"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Dirección
            </Button>
          </div>

          {!addresses || addresses.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <MapPin className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No tienes direcciones guardadas
                </h3>
                <p className="text-gray-600 mb-6">
                  Agrega una dirección para facilitar tus compras futuras
                </p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-primary hover:bg-primary-hover"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Primera Dirección
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addresses.map((address) => (
                <Card
                  key={address.id}
                  className={`relative hover:shadow-lg transition-shadow ${
                    address.isDefault ? "border-primary border-2" : ""
                  }`}
                >
                  {address.isDefault && (
                    <div className="absolute -top-3 left-4">
                      <Badge className="bg-primary text-white">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Predeterminada
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getLabelIcon(address.label)}
                        <CardTitle className="text-lg">
                          {address.label || "Dirección"}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        {address.firstName} {address.lastName}
                      </p>
                      <p className="text-gray-600">{address.phone}</p>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p>{address.streetAddress} {address.streetNumber}</p>
                      {address.apartment && <p>Depto/Piso: {address.apartment}</p>}
                      <p>
                        {address.city}, {address.state}
                      </p>
                      <p>CP: {address.postalCode}</p>
                      <p>{address.country}</p>
                    </div>

                    <div className="pt-3 border-t flex gap-2">
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                          className="flex-1"
                          disabled={setDefaultMutation.isPending}
                        >
                          <Star className="w-3 h-3 mr-1" />
                          Predeterminar
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(address)}
                        className={address.isDefault ? "flex-1" : ""}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(address.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddressDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        address={editingAddress}
      />
    </div>
  );
}
