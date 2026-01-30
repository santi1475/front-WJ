'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { UserCheck, Mail, User } from 'lucide-react';

import { IResponsableInfo } from '@/features/shared/types';

interface ResponsableCardProps {
  responsable?: IResponsableInfo | null;
  isEditMode?: boolean;
  onUpdateField?: (field: string, value: any) => void;
}

export function ResponsableCard({ responsable, isEditMode, onUpdateField }: ResponsableCardProps) {
  if (!responsable) {
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
          <Badge variant="default" className="text-xs">ID: {responsable.id}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className={`rounded-lg p-4 border ${isEditMode ? 'bg-primary/5 border-primary/20' : 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20'}`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
              {responsable.full_name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              {isEditMode ? (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                      Nombre Completo
                    </p>
                    <Input
                      value={responsable.full_name}
                      onChange={(e) => onUpdateField?.('responsable_info', {
                        ...responsable,
                        full_name: e.target.value,
                      })}
                      className="text-base font-bold"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                      Usuario
                    </p>
                    <Input
                      value={responsable.username}
                      onChange={(e) => onUpdateField?.('responsable_info', {
                        ...responsable,
                        username: e.target.value,
                      })}
                      className="text-sm font-mono"
                    />
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-base md:text-lg font-bold text-foreground truncate">
                    {responsable.full_name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">@{responsable.username}</p>
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
                Email
              </p>
              {isEditMode ? (
                <Input
                  type="email"
                  value={responsable.email}
                  onChange={(e) => onUpdateField?.('responsable_info', {
                    ...responsable,
                    email: e.target.value,
                  })}
                  className="text-sm"
                />
              ) : (
                <p className="text-sm font-medium text-foreground break-all">
                  {responsable.email}
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
                {responsable.id}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
