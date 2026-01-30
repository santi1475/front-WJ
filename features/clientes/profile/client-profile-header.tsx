'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, Pencil } from 'lucide-react';

import { ICliente } from '@/features/shared/types';

interface ClientProfileHeaderProps {
  client: ICliente;
  onEdit?: () => void;
  isEditMode?: boolean;
  onUpdateField?: (field: string, value: any) => void;
}

export function ClientProfileHeader({ client, onEdit, isEditMode, onUpdateField }: ClientProfileHeaderProps) {
  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateMonthsActive = (date?: string) => {
    if (!date) return 0;
    const startDate = new Date(date);
    const today = new Date();
    const months = (today.getFullYear() - startDate.getFullYear()) * 12 + (today.getMonth() - startDate.getMonth());
    return months;
  };

  const monthsActive = calculateMonthsActive(client.fecha_ingreso);

  return (
    <div className="space-y-8 mb-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
        <div className="space-y-4 flex-1">
          <div className="flex items-start gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                  {client.razon_social}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">RUC: {client.ruc}</p>
              </div>
            </div>
            <Badge variant={client.estado ? 'default' : 'secondary'} className="text-xs px-3 py-1.5 h-fit">
              {client.estado ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>
        {onEdit && (
          <Button
            onClick={onEdit}
            variant="outline"
            size="sm"
            className="self-start md:self-auto gap-2 border-border/60 hover:border-primary/40 hover:bg-primary/5 bg-transparent"
          >
            <Pencil className="w-4 h-4" />
            <span className="hidden sm:inline">Editar Datos</span>
            <span className="sm:hidden">Editar</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className={`backdrop-blur-sm border rounded-lg p-4 md:p-5 ${isEditMode ? 'bg-primary/5 border-primary/20' : 'bg-card/50 border-border/40'}`}>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Propietario</p>
          {isEditMode ? (
            <Input
              value={client.propietario}
              onChange={(e) => onUpdateField?.('propietario', e.target.value)}
              className="mt-2 text-sm"
            />
          ) : (
            <p className="text-sm md:text-base font-semibold text-foreground mt-2">
              {client.propietario}
            </p>
          )}
        </div>
        <div className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-lg p-4 md:p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Cliente Desde</p>
          <p className="text-sm md:text-base font-semibold text-foreground mt-2">
            {formatDate(client.fecha_ingreso)}
          </p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-lg p-4 md:p-5 col-span-2 md:col-span-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Tiempo con nosotros</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-2xl font-bold text-primary">{monthsActive}</p>
            <p className="text-xs text-muted-foreground">{monthsActive === 1 ? 'mes' : 'meses'}</p>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-border via-border to-transparent" />
    </div>
  );
}
