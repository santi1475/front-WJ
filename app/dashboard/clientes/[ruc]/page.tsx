'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ClientProfileHeader } from '@/features/clientes/profile/client-profile-header';
import { BasicInfoCard } from '@/features/clientes/profile/basic-info-card';
import { TaxAndLegalCard } from '@/features/clientes/profile/tax-and-legal-card';
import { FinancialCard } from '@/features/clientes/profile/financial-card';
import { LaboralCard } from '@/features/clientes/profile/laboral-card';
import { CredentialsCard } from '@/features/clientes/profile/credentials-card';
import { ResponsableCard } from '@/features/clientes/profile/responsable-card';
import { StatusSection } from '@/features/clientes/profile/status-section';
import { Check, X, Loader2, ArrowLeft } from 'lucide-react';
import { clientesService } from '@/features/clientes/services/clientes';
import { ICliente } from '@/features/shared/types';
import { toast } from 'sonner';

export default function ClientProfilePage() {
    const params = useParams();
    const router = useRouter();
    const ruc = params.ruc as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [client, setClient] = useState<ICliente | null>(null);
    const [editData, setEditData] = useState<ICliente | null>(null);

    useEffect(() => {
        if (ruc) {
            loadClientData(ruc);
        }
    }, [ruc]);

    const loadClientData = async (clientRuc: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await clientesService.getById(clientRuc);
            setClient(data);
            setEditData(data);
        } catch (err) {
            console.error('Error loading client:', err);
            setError('No se pudo cargar la información del cliente.');
            toast.error('Error al cargar datos del cliente');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = (field: string, value: string | number | boolean | object | null | undefined) => {
        if (!editData) return;
        setEditData((prev) => {
            if (!prev) return null;

            const credentialFields = [
                'sol_usuario', 'sol_clave', 'detraccion_cuenta', 'detraccion_usuario', 'detraccion_clave',
                'inei_usuario', 'inei_clave', 'afp_net_usuario', 'afp_net_clave', 'viva_essalud_usuario',
                'viva_essalud_clave', 'sis_clave', 'pe', 'clave_osce', 'clave_sencico'
            ];

            if (credentialFields.includes(field)) {
                return {
                    ...prev,
                    credenciales: {
                        ...(prev.credenciales || {}),
                        [field]: value,
                    }
                };
            }

            // Normal shallow fields
            return {
                ...prev,
                [field]: value,
            };
        });
    };

    const handleSave = async () => {
        if (!editData || !client) return;

        try {
            setIsSaving(true);

            await clientesService.update(client.ruc, editData);

            setClient(editData);
            setIsEditMode(false);
            toast.success('Cambios guardados exitosamente');
        } catch (err) {
            console.error('Error updating client:', err);
            toast.error('Error al guardar los cambios');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditData(client);
        setIsEditMode(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-muted/20">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Cargando información del cliente...</p>
                </div>
            </div>
        );
    }

    if (error || !client || !editData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-linear-to-b from-background to-muted/20">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-destructive">Error</h2>
                    <p className="text-muted-foreground">{error || 'No se encontró el cliente'}</p>
                </div>
                <Button onClick={() => router.back()} variant="outline" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </Button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50/50 dark:bg-[#020617] relative selection:bg-blue-500/30">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
                <Button
                    onClick={() => router.back()}
                    variant="ghost"
                    className="mb-8 pl-0 hover:bg-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all group font-bold tracking-wide"
                >
                    <div className="h-8 w-8 rounded-full bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center mr-3 group-hover:bg-slate-200 dark:group-hover:bg-slate-800 transition-colors">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    Volver al directorio
                </Button>

                <ClientProfileHeader
                    client={isEditMode ? editData : client}
                    onEdit={client.estado ? () => {
                        setEditData(client);
                        setIsEditMode(true);
                    } : undefined}
                    isEditMode={isEditMode}
                    onUpdateField={handleUpdate}
                />

                {isEditMode && (
                    <div className="flex items-center justify-end gap-4 mt-8 mb-8 sticky top-6 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-2xl shadow-blue-900/5 dark:shadow-black/40 transition-all duration-300 ring-1 ring-white/20 dark:ring-white/5">
                        <Button
                            onClick={handleCancel}
                            variant="outline"
                            size="default"
                            className="gap-2 h-11 px-6 border-slate-200 hover:bg-slate-100/50 hover:text-rose-500 dark:border-slate-800 dark:hover:bg-slate-800/50 rounded-xl text-slate-700 dark:text-slate-300 font-bold"
                            disabled={isSaving}
                        >
                            <X className="w-4 h-4" />
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSave}
                            size="default"
                            className="gap-2 h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 rounded-xl font-bold active:scale-95 transition-all"
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            Guardar Cambios
                        </Button>
                    </div>
                )}

                <StatusSection client={isEditMode ? editData : client} />

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-10">
                    <BasicInfoCard client={isEditMode ? editData : client} isEditMode={isEditMode} onUpdateField={handleUpdate} />
                    <TaxAndLegalCard client={isEditMode ? editData : client} isEditMode={isEditMode} onUpdateField={handleUpdate} />
                    <FinancialCard client={isEditMode ? editData : client} isEditMode={isEditMode} onUpdateField={handleUpdate} />
                    <LaboralCard client={isEditMode ? editData : client} isEditMode={isEditMode} onUpdateField={handleUpdate} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 md:mt-10">
                    <div className="lg:col-span-2">
                        <ResponsableCard responsable={isEditMode ? editData.responsable_info : client.responsable_info} isEditMode={isEditMode} onUpdateField={handleUpdate} />
                    </div>
                </div>

                <div className="mt-8 md:mt-10">
                    <CredentialsCard credenciales={isEditMode ? editData.credenciales : client.credenciales} isEditMode={isEditMode} onUpdateField={handleUpdate} />
                </div>
            </div>
        </main>
    );
}
