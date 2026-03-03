import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, BookOpen } from 'lucide-react';

import { ICliente, ILibroSocietario } from '@/features/shared/types';
import { libroSocietarioService } from '@/features/shared/services/libro-societario.service';

interface BasicInfoCardProps {
  client: ICliente;
  isEditMode?: boolean;
  onUpdateField?: (field: string, value: any) => void;
}

export function BasicInfoCard({ client, isEditMode, onUpdateField }: BasicInfoCardProps) {
  const [librosDisponibles, setLibrosDisponibles] = useState<ILibroSocietario[]>([]);

  useEffect(() => {
    libroSocietarioService.getAll()
      .then(data => setLibrosDisponibles(data))
      .catch(err => console.error("Error fetching libros", err));
  }, []);

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

          {/* Libros Societarios */}
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center gap-1.5 mb-2.5">
              <BookOpen className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Libros Societarios</p>
            </div>

            {isEditMode ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {librosDisponibles.length === 0 ? (
                  <span className="text-xs text-muted-foreground">Cargando opciones...</span>
                ) : (
                  librosDisponibles.map(libro => (
                    <div key={libro.id} className="flex items-center space-x-1.5 bg-muted/30 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-md">
                      <Checkbox
                        id={`libro-profile-${libro.id}`}
                        checked={(client.libros_societarios || []).includes(libro.id)}
                        onCheckedChange={(checked) => {
                          const current = client.libros_societarios || [];
                          const newVal = checked
                            ? [...current, libro.id]
                            : current.filter(id => id !== libro.id);
                          onUpdateField?.('libros_societarios', newVal);
                        }}
                        className="border-border bg-input"
                      />
                      <label htmlFor={`libro-profile-${libro.id}`} className="text-sm font-medium leading-none cursor-pointer">
                        {libro.nombre}
                      </label>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {client.libros_societarios_detalles && client.libros_societarios_detalles.length > 0 ? (
                  client.libros_societarios_detalles.map(libro => (
                    <Badge key={libro.id} variant="secondary" className="font-normal border-border bg-slate-100 dark:bg-slate-800 text-foreground text-xs">
                      {libro.nombre}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No hay libros registrados</p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
