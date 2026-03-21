'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { TrendingUp } from 'lucide-react';

import { ICliente } from '@/features/shared/types';

interface FinancialCardProps {
  client: ICliente;
  isEditMode?: boolean;
  onUpdateField?: (field: string, value: string | boolean) => void;
}

export function FinancialCard({ client, isEditMode, onUpdateField }: FinancialCardProps) {
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const monthlyAmount = parseFloat(client.ingresos_mensuales);
  const annualAmount = parseFloat(client.ingresos_anuales);

  return (
    <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-lg shadow-slate-200/40 dark:shadow-black/20 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 group h-full overflow-hidden">
      <CardHeader className="pb-4 bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base md:text-lg">Información Financiera</CardTitle>
            <CardDescription className="text-xs md:text-sm">Ingresos y contabilidad</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-3.5">
          <div className="bg-linear-to-br from-primary/5 to-primary/10 rounded-lg p-3 border border-primary/20">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Ingresos Mensuales</p>
            {isEditMode ? (
              <Input
                value={client.ingresos_mensuales}
                onChange={(e) => onUpdateField?.('ingresos_mensuales', e.target.value)}
                className="text-lg font-bold border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
              />
            ) : (
              <>
                <p className="text-lg md:text-xl font-bold text-primary">
                  {formatCurrency(client.ingresos_mensuales)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Promedio: {formatCurrency((monthlyAmount / 30).toString())} / día
                </p>
              </>
            )}
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Ingresos Anuales</p>
            {isEditMode ? (
              <Input
                value={client.ingresos_anuales}
                onChange={(e) => onUpdateField?.('ingresos_anuales', e.target.value)}
                className="text-lg font-bold border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
              />
            ) : (
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(client.ingresos_anuales)}
              </p>
            )}
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">
              Selectivo Consumo
            </p>
            {isEditMode ? (
              <div className="flex items-center gap-2 pt-1 border p-2 rounded-md bg-muted/30">
                <Checkbox
                  checked={client.selectivo_consumo}
                  onCheckedChange={(checked: boolean | 'indeterminate') => onUpdateField?.('selectivo_consumo', checked === true)}
                  className="border-border bg-input"
                />
                <span className="text-sm font-medium">Aplica Selectivo Consumo</span>
              </div>
            ) : (
              <Badge variant={client.selectivo_consumo ? 'default' : 'outline'} className="text-xs">
                {client.selectivo_consumo ? 'Aplica' : 'No aplica'}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
