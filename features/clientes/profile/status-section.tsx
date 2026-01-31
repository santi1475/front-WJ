import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

import { ICliente } from '@/features/shared/types';

interface StatusSectionProps {
  client: ICliente;
}

export function StatusSection({ client }: StatusSectionProps) {
  const statuses = [
    {
      label: 'Estado General',
      value: client.estado ? 'Activo' : 'Inactivo',
      icon: client.estado ? CheckCircle : AlertCircle,
      color: client.estado ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      bgColor: client.estado
        ? 'bg-green-50 dark:bg-green-950/20'
        : 'bg-red-50 dark:bg-red-950/20',
      borderColor: client.estado
        ? 'border-green-200 dark:border-green-900'
        : 'border-red-200 dark:border-red-900',
    },
    {
      label: 'Categoría',
      value: client.categoria === 'A' ? 'Mayor Tamaño' : client.categoria === 'B' ? 'Tamaño Medio' : 'Pequeño',
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-900',
    },
    {
      label: 'Régimen',
      value: client.regimen_tributario,
      icon: Clock,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200 dark:border-purple-900',
    },
    {
      label: 'Selectivo Consumo',
      value: client.selectivo_consumo ? 'Aplica' : 'No aplica',
      icon: client.selectivo_consumo ? CheckCircle : Clock,
      color: client.selectivo_consumo
        ? 'text-orange-600 dark:text-orange-400'
        : 'text-slate-600 dark:text-slate-400',
      bgColor: client.selectivo_consumo
        ? 'bg-orange-50 dark:bg-orange-950/20'
        : 'bg-slate-200/70 dark:bg-slate-950/20',
      borderColor: client.selectivo_consumo
        ? 'border-orange-200 dark:border-orange-900'
        : 'border-slate-200 dark:border-slate-900',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
      {statuses.map((status) => {
        const IconComponent = status.icon;
        return (
          <div
            key={status.label}
            className={`rounded-lg border p-4 transition-all duration-300 ${status.bgColor} ${status.borderColor} hover:shadow-md`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                {status.label}
              </p>
              <IconComponent className={`w-4 h-4 flex-shrink-0 ${status.color}`} />
            </div>
            <p className={`text-sm md:text-base font-bold ${status.color}`}>
              {status.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
