'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Lock, Pencil } from 'lucide-react';

import { ICredenciales } from '@/features/shared/types';

interface CredentialsCardProps {
  credenciales: ICredenciales;
  onEdit?: () => void;
  isEditMode?: boolean;
  onUpdateField?: (field: string, value: any) => void;
}

interface CredentialItem {
  label: string;
  usuario?: string;
  clave?: string;
  cuenta?: string;
  especial?: string;
}

export function CredentialsCard({ credenciales, onEdit, isEditMode, onUpdateField }: CredentialsCardProps) {
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const credentialsList: CredentialItem[] = [
    {
      label: 'SOL',
      usuario: credenciales.sol_usuario,
      clave: credenciales.sol_clave,
    },
    {
      label: 'Detracción',
      cuenta: credenciales.detraccion_cuenta,
      usuario: credenciales.detraccion_usuario,
      clave: credenciales.detraccion_clave,
    },
    {
      label: 'INEI',
      usuario: credenciales.inei_usuario,
      clave: credenciales.inei_clave,
    },
    {
      label: 'AFP Net',
      usuario: credenciales.afp_net_usuario,
      clave: credenciales.afp_net_clave,
    },
    {
      label: 'Viva Essalud',
      usuario: credenciales.viva_essalud_usuario,
      clave: credenciales.viva_essalud_clave,
    },
    {
      label: 'SIS',
      usuario: credenciales.sis_usuario,
      clave: credenciales.sis_clave,
    },
    {
      label: 'Planilla Electrónica',
      especial: credenciales.pe,
    },
  ];

  const togglePasswordVisibility = (key: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const hasAnyCredential = credentialsList.some(
    (item) => item.usuario || item.cuenta || item.especial
  );

  return (
    <Card className="border border-border/50 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 group">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base md:text-lg">Credenciales de Acceso</CardTitle>
              <CardDescription className="text-xs md:text-sm">Autenticación en sistemas externos</CardDescription>
            </div>
          </div>
          {onEdit && (
            <Button
              onClick={onEdit}
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-foreground h-auto"
            >
              <Pencil className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Editar</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {!hasAnyCredential ? (
          <div className="py-8 text-center">
            <Lock className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Sin credenciales registradas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {credentialsList.map((item) => {
              const key = item.label.toLowerCase().replace(/\s+/g, '-');
              const hasData =
                item.usuario ||
                item.cuenta ||
                item.especial ||
                (item.label === 'SOL' && item.usuario);

              if (!hasData) return null;

              const isConfigured = !!(item.usuario || item.cuenta);

              return (
                <div
                  key={key}
                  className={`p-4 rounded-lg border transition-all duration-200 space-y-3 ${isConfigured
                      ? 'bg-gradient-to-br from-green-50/50 to-green-50/20 dark:from-green-950/20 dark:to-green-950/10 border-green-200/50 dark:border-green-900/30 hover:border-green-300/50'
                      : 'bg-card/50 border-border/40 hover:border-border/60'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-foreground">{item.label}</h4>
                    <Badge
                      variant={isConfigured ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {isConfigured ? 'Activo' : 'Pendiente'}
                    </Badge>
                  </div>

                  <div className="space-y-2.5 border-t border-border/30 pt-3">
                    {item.cuenta && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                          Cuenta
                        </p>
                        {isEditMode ? (
                          <Input
                            value={item.cuenta}
                            onChange={(e) => onUpdateField?.(`detraccion_cuenta`, e.target.value)}
                            className="text-xs font-mono"
                            placeholder="Número de cuenta"
                          />
                        ) : (
                          <p className="text-xs font-mono bg-muted/40 rounded px-2 py-1.5 text-foreground break-all">
                            {item.cuenta}
                          </p>
                        )}
                      </div>
                    )}

                    {item.usuario && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                          Usuario
                        </p>
                        {isEditMode ? (
                          <Input
                            value={item.usuario}
                            onChange={(e) => {
                              const fieldMap: Record<string, string> = {
                                'SOL': 'sol_usuario',
                                'Detracción': 'detraccion_usuario',
                                'INEI': 'inei_usuario',
                                'AFP Net': 'afp_net_usuario',
                                'Essalud': 'viva_essalud_usuario',
                                'SIS': 'sis_usuario',
                              };
                              onUpdateField?.(fieldMap[item.label] || 'sol_usuario', e.target.value);
                            }}
                            className="text-xs font-mono"
                            placeholder="Usuario"
                          />
                        ) : (
                          <p className="text-xs font-mono bg-muted/40 rounded px-2 py-1.5 text-foreground">
                            {item.usuario}
                          </p>
                        )}
                      </div>
                    )}

                    {item.clave && (
                      <div className="bg-gradient-to-br from-orange-50/40 to-orange-50/20 dark:from-orange-950/20 dark:to-orange-950/10 rounded-lg p-2.5 border border-orange-200/40 dark:border-orange-900/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Lock className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                              Contraseña
                            </p>
                          </div>
                          {!isEditMode && (
                            <button
                              onClick={() => togglePasswordVisibility(key)}
                              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-1.5 py-0.5 rounded hover:bg-muted/40 flex items-center gap-1"
                              aria-label={showPasswords[key] ? 'Ocultar' : 'Mostrar'}
                              title={showPasswords[key] ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                              {showPasswords[key] ? (
                                <>
                                  <EyeOff className="w-3 h-3" />
                                  <span className="hidden sm:inline">Ocultar</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3 h-3" />
                                  <span className="hidden sm:inline">Mostrar</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                        {isEditMode ? (
                          <Input
                            type="password"
                            value={item.clave}
                            onChange={(e) => {
                              const fieldMap: Record<string, string> = {
                                'SOL': 'sol_clave',
                                'Detracción': 'detraccion_clave',
                                'INEI': 'inei_clave',
                                'AFP Net': 'afp_net_clave',
                                'Viva Essalud': 'viva_essalud_clave',
                                'SIS': 'sis_clave',
                              };
                              onUpdateField?.(fieldMap[item.label] || 'sol_clave', e.target.value);
                            }}
                            className="text-xs font-mono"
                            placeholder="Contraseña"
                          />
                        ) : (
                          <div className="bg-background/60 rounded px-2.5 py-1.5 font-mono text-xs text-foreground break-all leading-relaxed border border-orange-200/30 dark:border-orange-900/20">
                            {showPasswords[key]
                              ? item.clave
                              : '•'.repeat(item.clave.length)}
                          </div>
                        )}
                      </div>
                    )}

                    {item.especial && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                          Valor
                        </p>
                        {isEditMode ? (
                          <Input
                            value={item.especial}
                            onChange={(e) => onUpdateField?.('pe', e.target.value)}
                            className="text-xs font-mono"
                            placeholder="Valor"
                          />
                        ) : (
                          <p className="text-xs font-mono bg-muted/40 rounded px-2 py-1.5 text-foreground break-all">
                            {item.especial}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
