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
import { Scale } from 'lucide-react';

import { ICliente } from '@/features/shared/types';

interface TaxAndLegalCardProps {
  client: ICliente;
  isEditMode?: boolean;
  onUpdateField?: (field: string, value: string | number) => void;
}

const regimenTributarioColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  GENERAL: 'default',
  ESPECIAL: 'secondary',
  RMT: 'outline',
  RUS: 'destructive',
};

const tipoEmpresaColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  SAC: 'default',
  EIRL: 'secondary',
  SRL: 'outline',
  SA: 'default',
  PN: 'secondary',
};

const categoriaInfo: Record<string, { label: string; description: string }> = {
  A: { label: 'A', description: 'A' },
  B: { label: 'B', description: 'B' },
  C: { label: 'C', description: 'C' },
  'N/T': { label: 'N/T', description: 'N/T' },
};

export function TaxAndLegalCard({ client, isEditMode, onUpdateField }: TaxAndLegalCardProps) {
  const catInfo = categoriaInfo[client.categoria] || { label: client.categoria, description: 'No especificada' };

  return (
    <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-lg shadow-slate-200/40 dark:shadow-black/20 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 group h-full overflow-hidden">
      <CardHeader className="pb-4 bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
            <Scale className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base md:text-lg">Tributación</CardTitle>
            <CardDescription className="text-xs md:text-sm">Clasificación legal</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-3.5">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Régimen Tributario</p>
            {isEditMode ? (
              <Select value={client.regimen_tributario} onValueChange={(value) => onUpdateField?.('regimen_tributario', value)}>
                <SelectTrigger className="text-xs md:text-sm border-slate-300 dark:border-slate-600">
                  <SelectValue placeholder="Seleccionar régimen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERAL">GENERAL</SelectItem>
                  <SelectItem value="ESPECIAL">ESPECIAL</SelectItem>
                  <SelectItem value="RMT">RMT</SelectItem>
                  <SelectItem value="RUS">RUS</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant={regimenTributarioColors[client.regimen_tributario] || 'outline'} className="text-xs md:text-sm px-3 py-1.5">
                {client.regimen_tributario}
              </Badge>
            )}
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Tipo de Empresa</p>
            {isEditMode ? (
              <Select value={client.tipo_empresa} onValueChange={(value) => onUpdateField?.('tipo_empresa', value)}>
                <SelectTrigger className="text-xs md:text-sm border-slate-300 dark:border-slate-600">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAC">SAC</SelectItem>
                  <SelectItem value="EIRL">EIRL</SelectItem>
                  <SelectItem value="SRL">SRL</SelectItem>
                  <SelectItem value="SA">SA</SelectItem>
                  <SelectItem value="PN">PN</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant={tipoEmpresaColors[client.tipo_empresa] || 'outline'} className="text-xs md:text-sm px-3 py-1.5">
                {client.tipo_empresa}
              </Badge>
            )}
          </div>

          <div className="bg-linear-to-br from-accent/5 to-accent/10 rounded-lg p-3 border border-accent/20">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
              Categoría
            </p>
            {isEditMode ? (
              <Select value={client.categoria || ''} onValueChange={(value) => onUpdateField?.('categoria', value)}>
                <SelectTrigger className="text-sm font-medium border-slate-300 dark:border-slate-600">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Categoría A</SelectItem>
                  <SelectItem value="B">Categoría B</SelectItem>
                  <SelectItem value="C">Categoría C</SelectItem>
                  <SelectItem value="N/T">N/T</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-foreground font-medium">{catInfo.description || client.categoria}</p>
            )}
          </div>

          {client.codigo_control !== undefined && client.codigo_control !== null && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1.5">
                Código Control
              </p>
              {isEditMode ? (
                <input
                  value={client.codigo_control}
                  onChange={(e) => onUpdateField?.('codigo_control', parseInt(e.target.value) || 0)}
                  className="w-full text-sm font-mono font-semibold text-foreground bg-muted/30 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5"
                />
              ) : (
                <p className="text-sm font-mono font-semibold text-foreground bg-muted/30 rounded px-2.5 py-1.5">
                  {client.codigo_control === 0 ? "-" : client.codigo_control}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
