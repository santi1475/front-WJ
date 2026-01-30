'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { TrendingUp } from 'lucide-react';

import { ICliente } from '@/features/shared/types';

interface FinancialCardProps {
  client: ICliente;
  isEditMode?: boolean;
  onUpdateField?: (field: string, value: any) => void;
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
    <Card className="border border-border/50 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 group h-full">
      <CardHeader className="pb-3">
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
      <CardContent className="space-y-4">
        <div className="space-y-3.5">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-3 border border-primary/20">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Ingresos Mensuales</p>
            {isEditMode ? (
              <Input
                value={client.ingresos_mensuales}
                onChange={(e) => onUpdateField?.('ingresos_mensuales', e.target.value)}
                className="text-lg font-bold"
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
                className="text-lg font-bold"
              />
            ) : (
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(client.ingresos_anuales)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/30 rounded-lg p-2.5 border border-secondary/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                Libros
              </p>
              <p className="text-base font-bold text-foreground">{client.libros_societarios}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                Selectivo Consumo
              </p>
              <Badge variant={client.selectivo_consumo ? 'default' : 'outline'} className="text-xs">
                {client.selectivo_consumo ? 'Aplica' : 'No aplica'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
