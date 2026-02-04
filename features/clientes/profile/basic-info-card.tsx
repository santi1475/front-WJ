'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText } from 'lucide-react';

import { ICliente } from '@/features/shared/types';

interface BasicInfoCardProps {
  client: ICliente;
  isEditMode?: boolean;
  onUpdateField?: (field: string, value: any) => void;
}

export function BasicInfoCard({ client, isEditMode, onUpdateField }: BasicInfoCardProps) {
  return (
    <Card className="border border-border/50 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 group h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base md:text-lg">Información Básica</CardTitle>
            <CardDescription className="text-xs md:text-sm">Datos fundamentales</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3.5">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1.5">RUC</p>
            {isEditMode ? (
              <Input
                value={client.ruc}
                onChange={(e) => onUpdateField?.('ruc', e.target.value)}
                className="text-sm font-mono border-slate-300 dark:border-slate-600"
              />
            ) : (
              <p className="text-sm md:text-base font-mono font-semibold text-foreground bg-muted/30 rounded px-2.5 py-1.5">
                {client.ruc}
              </p>
            )}
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1.5">Razón Social</p>
            {isEditMode ? (
              <Input
                value={client.razon_social}
                onChange={(e) => onUpdateField?.('razon_social', e.target.value)}
                className="text-sm border-slate-300 dark:border-slate-600"
              />
            ) : (
              <p className="text-sm font-medium text-foreground line-clamp-2">
                {client.razon_social}
              </p>
            )}
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1.5">Propietario</p>
            {isEditMode ? (
              <Input
                value={client.propietario}
                onChange={(e) => onUpdateField?.('propietario', e.target.value)}
                className="text-sm border-slate-300 dark:border-slate-600"
              />
            ) : (
              <p className="text-sm font-medium text-foreground">
                {client.propietario}
              </p>
            )}
          </div>

          {client.dni_propietario && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1.5">DNI</p>
              {isEditMode ? (
                <Input
                  value={client.dni_propietario}
                  onChange={(e) => onUpdateField?.('dni_propietario', e.target.value)}
                  className="text-sm font-mono border-slate-300 dark:border-slate-600"
                />
              ) : (
                <p className="text-sm font-mono font-semibold text-foreground bg-muted/30 rounded px-2.5 py-1.5">
                  {client.dni_propietario}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
