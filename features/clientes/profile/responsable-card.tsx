'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { UserCheck, Mail, User } from 'lucide-react';

import { useEffect, useState } from 'react';
import { IResponsableInfo } from '@/features/shared/types';
import { IResponsable } from '@/features/responsables/types/responsable';
import { responsableService } from '@/features/responsables/services/responsable.service';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ResponsableCardProps {
  responsable?: IResponsableInfo | null;
  isEditMode?: boolean;
  onUpdateField?: (field: string, value: any) => void;
}

export function ResponsableCard({ responsable, isEditMode, onUpdateField }: ResponsableCardProps) {
  const [responsables, setResponsables] = useState<IResponsable[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadResponsables();
    }
  }, [isEditMode]);

  const loadResponsables = async () => {
    try {
      setLoading(true);
      const data = await responsableService.getAll();
      setResponsables(data);
    } catch (error) {
      console.error('Error loading responsables:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponsableChange = (responsableId: string) => {
    const selected = responsables.find(r => r.id.toString() === responsableId);
    if (selected && onUpdateField) {
      // Update the responsable_info which is used for display
      onUpdateField('responsable_info', {
        id: selected.id,
        nombre: selected.nombre,
        celular: selected.celular,
        activo: selected.activo,
      });
      onUpdateField('responsable', selected.id);
    }
  };
  if (!responsable && !isEditMode) {
    return (
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-base md:text-lg">Responsable Asignado</CardTitle>
              <CardDescription className="text-xs md:text-sm">Gestor de la cuenta</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">Sin responsable asignado</p>
        </CardContent>
      </Card>
    );
  }

  const displayResponsable = responsable || {
    id: 0,
    nombre: 'Sin Asignar',
    celular: '-',
    activo: true
  };

  return (
    <Card className="border border-border/50 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 group">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <UserCheck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base md:text-lg">Responsable Asignado</CardTitle>
              <CardDescription className="text-xs md:text-sm">Gestor de la cuenta</CardDescription>
            </div>
          </div>
          {displayResponsable.id !== 0 && (
            <Badge variant="default" className="text-xs">ID: {displayResponsable.id}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className={`rounded-lg p-4 border ${isEditMode ? 'bg-primary/5 border-primary/20' : 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20'}`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
              {displayResponsable.nombre.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              {isEditMode ? (
                <div className="w-full">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                    Seleccionar Responsable
                  </p>
                  <Select
                    value={displayResponsable.id > 0 ? displayResponsable.id.toString() : ''}
                    onValueChange={handleResponsableChange}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {responsables.map((resp) => (
                        <SelectItem key={resp.id} value={resp.id.toString()}>
                          {resp.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <>
                  <h3 className="text-base md:text-lg font-bold text-foreground truncate">
                    {displayResponsable.nombre}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">Responsable</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`rounded-lg p-4 flex items-start gap-3 border ${isEditMode ? 'bg-primary/5 border-primary/20' : 'bg-card/50 border-border/40'}`}>
            <Mail className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                Teléfono / Celular
              </p>
              {isEditMode ? (
                <Input
                  type="text"
                  value={displayResponsable.celular || ''}
                  disabled={true}
                  className="text-sm opacity-50"
                  placeholder="Sin número"
                />
              ) : (
                <p className="text-sm font-medium text-foreground break-all">
                  {displayResponsable.celular || 'No registrado'}
                </p>
              )}
            </div>
          </div>

          <div className={`rounded-lg p-4 flex items-start gap-3 border ${isEditMode ? 'bg-primary/5 border-primary/20' : 'bg-card/50 border-border/40'}`}>
            <User className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                ID Usuario
              </p>
              <p className="text-sm font-mono font-semibold text-foreground">
                {displayResponsable.id}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
