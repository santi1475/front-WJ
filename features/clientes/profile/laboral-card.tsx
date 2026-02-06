'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Users } from 'lucide-react';

import { ICliente } from '@/features/shared/types';

interface LaboralCardProps {
  client: ICliente;
  isEditMode?: boolean;
  onUpdateField?: (field: string, value: any) => void;
}

export function LaboralCard({ client, isEditMode, onUpdateField }: LaboralCardProps) {
  const formatDate = (date?: string) => {
    if (!date) return 'No registrado';
    // Append T00:00:00 to force local time interpretation or split manually`
    // Best way to avoid timezone off-by-one on display is to use UTC components`
    const d = new Date(date);
    // Add timezone offset to compensate or just print UTC
    // Simple hack: append T12:00:00 to avoid midnight rollover issues
    // Better:
    const parts = date.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      return `${d}/${m}/${y}`; // Manual formatting to avoid Timezone
    }
    return new Date(date).toLocaleDateString('es-PE');
  };

  const isAccredited = !!client.regimen_laboral_fecha;

  return (
    <Card className="border border-border/50 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 group h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base md:text-lg">Información Laboral</CardTitle>
            <CardDescription className="text-xs md:text-sm">Régimen y acreditación</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3.5">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Tipo de Régimen</p>
            {isEditMode ? (
              <Select value={client.regimen_laboral_tipo || ''} onValueChange={(value) => onUpdateField?.('regimen_laboral_tipo', value)}>
                <SelectTrigger className="text-xs md:text-sm border-slate-300 dark:border-slate-600">
                  <SelectValue placeholder="Seleccionar régimen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Régimen General">Régimen General</SelectItem>
                  <SelectItem value="Régimen Especial">Régimen Especial</SelectItem>
                  <SelectItem value="Micro Empresa">Micro Empresa</SelectItem>
                </SelectContent>
              </Select>
            ) : client.regimen_laboral_tipo ? (
              <Badge variant="default" className="text-xs md:text-sm px-3 py-1.5">
                {client.regimen_laboral_tipo}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs md:text-sm">No especificado</Badge>
            )}
          </div>

          <div className={`rounded-lg p-3 border ${isAccredited ? 'bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-900' : 'bg-muted/30 border-border/50'}`}>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
              Fecha de Acreditación
            </p>
            {isEditMode ? (
              <input
                type="date"
                value={client.regimen_laboral_fecha || ''}
                onChange={(e) => onUpdateField?.('regimen_laboral_fecha', e.target.value)}
                className="w-full text-sm text-foreground bg-muted/30 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5"
              />
            ) : (
              <p className={`text-sm font-medium ${isAccredited ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'}`}>
                {formatDate(client.regimen_laboral_fecha)}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
