'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Lock, Pencil, Plus } from 'lucide-react';

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
  const [activeNewCredentials, setActiveNewCredentials] = useState<string[]>([]);

  // Clear newly added credentials blocks when exiting edit mode
  useEffect(() => {
    if (!isEditMode) {
      setActiveNewCredentials([]);
    }
  }, [isEditMode]);

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
      clave: credenciales.sis_clave,
    },
    {
      label: 'Partida Electrónica',
      especial: credenciales.pe,
    },
    {
      label: 'OSCE',
      clave: credenciales.clave_osce,
    },
    {
      label: 'SENCICO',
      clave: credenciales.clave_sencico,
    },
  ];

  const togglePasswordVisibility = (key: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const hasAnyCredential = credentialsList.some(
    (item) => item.usuario || item.cuenta || item.especial || item.clave
  ) || (isEditMode && activeNewCredentials.length > 0);

  const availableToAdd = credentialsList.filter(item => {
    const hasData = item.usuario || item.cuenta || item.especial || item.clave || (item.label === 'SOL' && item.usuario);
    return !hasData && !activeNewCredentials.includes(item.label);
  });

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
                item.clave ||
                (item.label === 'SOL' && item.usuario);

              const shouldShow = hasData || (isEditMode && activeNewCredentials.includes(item.label));

              if (!shouldShow) return null;

              const isConfigured = !!(item.usuario || item.cuenta || item.clave || item.especial);

              const isPE = item.label === 'Partida Electrónica';
              const isDetraccion = item.label === 'Detracción';
              const isSoloClave = ['OSCE', 'SENCICO'].includes(item.label);

              const showCuenta = item.cuenta || (isEditMode && isDetraccion);
              const showUsuario = item.usuario || (isEditMode && !isPE && !isSoloClave);
              const showClave = item.clave || (isEditMode && !isPE);
              const showEspecial = item.especial || (isEditMode && isPE);

              return (
                <div
                  key={key}
                  className={`p-4 rounded-lg border transition-all duration-200 space-y-3 ${isConfigured
                    ? 'bg-emerald-50/80 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/50 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-sm hover:shadow-md'
                    : 'bg-slate-50/50 border-slate-200 dark:bg-slate-900/30 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-foreground">{item.label}</h4>
                    <Badge
                      variant={isConfigured ? 'default' : 'secondary'}
                      className={`text-xs ${isConfigured
                        ? 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                    >
                      {isConfigured ? 'Activo' : 'Pendiente'}
                    </Badge>
                  </div>

                  <div className="space-y-2.5 border-t border-border/30 pt-3">
                    {showCuenta && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                          Cuenta
                        </p>
                        {isEditMode ? (
                          <Input
                            value={item.cuenta || ''}
                            onChange={(e) => onUpdateField?.(`detraccion_cuenta`, e.target.value)}
                            className="text-xs font-mono"
                            placeholder="Número de cuenta"
                          />
                        ) : (
                          <p className="text-xs font-mono bg-white/60 dark:bg-slate-800/60 rounded px-2 py-1.5 text-foreground break-all border border-slate-200/50 dark:border-slate-700/50">
                            {item.cuenta}
                          </p>
                        )}
                      </div>
                    )}

                    {showUsuario && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                          Usuario
                        </p>
                        {isEditMode ? (
                          <Input
                            value={item.usuario || ''}
                            onChange={(e) => {
                              const fieldMap: Record<string, string> = {
                                'SOL': 'sol_usuario',
                                'Detracción': 'detraccion_usuario',
                                'INEI': 'inei_usuario',
                                'AFP Net': 'afp_net_usuario',
                                'Viva Essalud': 'viva_essalud_usuario',
                                'SIS': 'sis_usuario',
                              };
                              onUpdateField?.(fieldMap[item.label] || 'sol_usuario', e.target.value);
                            }}
                            className="text-xs font-mono"
                            placeholder="Usuario"
                          />
                        ) : (
                          <p className="text-xs font-mono bg-white/60 dark:bg-slate-800/60 rounded px-2 py-1.5 text-foreground border border-slate-200/50 dark:border-slate-700/50">
                            {item.usuario}
                          </p>
                        )}
                      </div>
                    )}

                    {showClave && (
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/40 dark:to-orange-950/20 rounded-lg p-2.5 border border-amber-200/60 dark:border-amber-800/40 border-slate-200/50 dark:border-slate-700/50 transition-all hover:bg-gradient-to-br hover:from-amber-100 hover:to-orange-100/50 dark:hover:from-amber-900/60 dark:hover:to-orange-900/40">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Lock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                            <p className="text-xs text-amber-800 dark:text-amber-300 uppercase tracking-wider font-semibold">
                              Contraseña
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault(); // Prevent form submission if within form
                              togglePasswordVisibility(key);
                            }}
                            className="text-xs font-medium text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200 transition-colors px-1.5 py-0.5 rounded hover:bg-amber-100/50 dark:hover:bg-amber-900/30 flex items-center gap-1"
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
                        </div>
                        {isEditMode ? (
                          <div className="relative">
                            <Input
                              type={showPasswords[key] ? 'text' : 'password'}
                              value={item.clave || ''}
                              onChange={(e) => {
                                const fieldMap: Record<string, string> = {
                                  'SOL': 'sol_clave',
                                  'Detracción': 'detraccion_clave',
                                  'INEI': 'inei_clave',
                                  'AFP Net': 'afp_net_clave',
                                  'Viva Essalud': 'viva_essalud_clave',
                                  'SIS': 'sis_clave',
                                  'OSCE': 'clave_osce',
                                  'SENCICO': 'clave_sencico',
                                };
                                onUpdateField?.(fieldMap[item.label] || 'sol_clave', e.target.value);
                              }}
                              className="text-xs font-mono"
                              placeholder="Contraseña"
                            />
                          </div>
                        ) : (
                          <div className="bg-white/70 dark:bg-slate-900/60 rounded px-2.5 py-1.5 font-mono text-xs text-foreground break-all leading-relaxed border border-amber-200/40 dark:border-amber-800/30">
                            {showPasswords[key]
                              ? item.clave
                              : '•'.repeat(item.clave?.length || 0)}
                          </div>
                        )}
                      </div>
                    )}

                    {showEspecial && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                          Valor
                        </p>
                        {isEditMode ? (
                          <Input
                            value={item.especial || ''}
                            onChange={(e) => onUpdateField?.('pe', e.target.value)}
                            className="text-xs font-mono"
                            placeholder="Valor"
                          />
                        ) : (
                          <p className="text-xs font-mono bg-white/60 dark:bg-slate-800/60 rounded px-2 py-1.5 text-foreground break-all border border-slate-200/50 dark:border-slate-700/50">
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

        {/* Dynamic add credentials in Edit Mode */}
        {isEditMode && availableToAdd.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-secondary/20 p-4 rounded-lg border border-border/60">
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1">Añadir otra credencial</p>
                <p className="text-xs text-muted-foreground">Seleccione una credencial de la lista para añadir sus datos</p>
              </div>
              <Select onValueChange={(val) => setActiveNewCredentials(prev => [...prev, val])}>
                <SelectTrigger className="w-full sm:w-[250px] bg-background">
                  <SelectValue placeholder="Seleccionar credencial" />
                </SelectTrigger>
                <SelectContent>
                  {availableToAdd.map(item => (
                    <SelectItem key={item.label} value={item.label}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 