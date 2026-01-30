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

    const handleUpdate = (field: string, value: any) => {
        if (!editData) return;
        setEditData((prev) => {
            if (!prev) return null;
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Cargando información del cliente...</p>
                </div>
            </div>
        );
    }

    if (error || !client || !editData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-background to-muted/20">
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
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
                <Button
                    onClick={() => router.back()}
                    variant="ghost"
                    className="mb-6 pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al listado
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
                    <div className="flex items-center justify-end gap-3 mt-6 mb-8 sticky top-4 z-10 bg-background/80 backdrop-blur-sm p-2 rounded-lg border shadow-sm">
                        <Button
                            onClick={handleSave}
                            size="sm"
                            className="gap-2"
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            Guardar Cambios
                        </Button>
                        <Button
                            onClick={handleCancel}
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-transparent"
                            disabled={isSaving}
                        >
                            <X className="w-4 h-4" />
                            Cancelar
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
