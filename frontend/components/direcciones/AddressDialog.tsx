"use client";

import { useState, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { addressesApi, type Address, type CreateAddressData } from "@/lib/api/addresses";
import { toast } from "sonner";

interface AddressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  address?: Address | null;
}

export function AddressDialog({ isOpen, onClose, address }: AddressDialogProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateAddressData>({
    label: "",
    firstName: "",
    lastName: "",
    phone: "",
    streetAddress: "",
    streetNumber: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Argentina",
    isDefault: false,
  });

  useEffect(() => {
    if (address) {
      setFormData({
        label: address.label || "",
        firstName: address.firstName,
        lastName: address.lastName,
        phone: address.phone,
        streetAddress: address.streetAddress,
        streetNumber: address.streetNumber,
        apartment: address.apartment || "",
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        isDefault: address.isDefault,
      });
    } else {
      setFormData({
        label: "",
        firstName: "",
        lastName: "",
        phone: "",
        streetAddress: "",
        streetNumber: "",
        apartment: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Argentina",
        isDefault: false,
      });
    }
  }, [address, isOpen]);

  const createMutation = useMutation({
    mutationFn: addressesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Dirección creada correctamente");
      onClose();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Error al crear la dirección");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateAddressData }) =>
      addressesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Dirección actualizada correctamente");
      onClose();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Error al actualizar la dirección");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (address) {
      updateMutation.mutate({ id: address.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {address ? "Editar Dirección" : "Nueva Dirección"}
          </DialogTitle>
          <DialogDescription>
            {address
              ? "Actualiza los datos de tu dirección de envío"
              : "Completa los datos de tu nueva dirección de envío"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="label">Etiqueta (opcional)</Label>
              <Input
                id="label"
                name="label"
                placeholder="Ej: Casa, Trabajo, Oficina"
                value={formData.label}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="firstName">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="lastName">
                Apellido <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="phone">
                Teléfono <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Ej: 11 1234-5678"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="streetAddress">
                Calle <span className="text-red-500">*</span>
              </Label>
              <Input
                id="streetAddress"
                name="streetAddress"
                placeholder="Ej: Av. Corrientes"
                value={formData.streetAddress}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="streetNumber">
                Número <span className="text-red-500">*</span>
              </Label>
              <Input
                id="streetNumber"
                name="streetNumber"
                placeholder="Ej: 1234"
                value={formData.streetNumber}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="apartment">Depto/Piso (opcional)</Label>
              <Input
                id="apartment"
                name="apartment"
                placeholder="Ej: 5to A"
                value={formData.apartment}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="city">
                Ciudad <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                name="city"
                placeholder="Ej: Buenos Aires"
                value={formData.city}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="state">
                Provincia <span className="text-red-500">*</span>
              </Label>
              <Input
                id="state"
                name="state"
                placeholder="Ej: CABA"
                value={formData.state}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="postalCode">
                Código Postal <span className="text-red-500">*</span>
              </Label>
              <Input
                id="postalCode"
                name="postalCode"
                placeholder="Ej: 1234"
                value={formData.postalCode}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="col-span-2 flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isDefault: checked as boolean }))
                }
                disabled={isLoading}
              />
              <Label
                htmlFor="isDefault"
                className="text-sm font-normal cursor-pointer"
              >
                Establecer como dirección predeterminada
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary-hover"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {address ? "Actualizando..." : "Guardando..."}
                </>
              ) : (
                <>{address ? "Actualizar" : "Guardar"} Dirección</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
