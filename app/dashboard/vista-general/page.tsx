"use client"

import { useState, useEffect } from "react"
import DashboardHeader from "@/components/manage-clients/header"
import DataGridView from "@/components/manage-clients/data-grid"
import CardView from "@/components/manage-clients/card-view"
import NewClientForm from "@/components/manage-clients/new-client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

import { Client } from "@/lib/interfaces/client"

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([])
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)
    const [loading, setLoading] = useState(true)
    const [isAdmin] = useState(true)
    const [showNewClientForm, setShowNewClientForm] = useState(false)

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const mockClients: Client[] = [
                    {
                        id: "1",
                        razonSocial: "Acme Corporation S.A.",
                        ruc: "20123456789",
                        responsable: "JOSE",
                        categoria: "A",
                        status: "Activo",
                        propietario: "Juan Pérez",
                        fechaIngreso: "2024-01-15",
                        claveSol: "Wj123456*",
                        solUser: "acme.sol",
                    },
                    {
                        id: "2",
                        razonSocial: "TechStart Solutions",
                        ruc: "20987654321",
                        responsable: "DIANA",
                        categoria: "B",
                        status: "Activo",
                        propietario: "María García",
                        fechaIngreso: "2024-02-20",
                        claveSol: "Tech9876@",
                        solUser: "techstart.sol",
                    },
                    {
                        id: "3",
                        razonSocial: "Innovate Perú",
                        ruc: "20555666777",
                        responsable: "CARLOS",
                        categoria: "C",
                        status: "Inactivo",
                        propietario: "Pedro López",
                        fechaIngreso: "2023-11-10",
                        claveSol: "Innov#2024",
                        solUser: "innovate.sol",
                    },
                    {
                        id: "4",
                        razonSocial: "Global Trade Inc",
                        ruc: "20888999000",
                        responsable: "JOSE",
                        categoria: "A",
                        status: "Activo",
                        propietario: "Ana Martínez",
                        fechaIngreso: "2024-03-05",
                        claveSol: "Global123!",
                        solUser: "global.sol",
                    },
                ]
                setClients(mockClients)
            } catch (error) {
                console.error("Failed to fetch clients:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchClients()
    }, [])

    const handleAddClient = (newClient: Client) => {
        setClients([...clients, newClient])
        setShowNewClientForm(false)
    }

    const handleDeleteClient = (clientId: string) => {
        setClients(clients.filter((c) => c.id !== clientId))
        if (selectedClient?.id === clientId) {
            setSelectedClient(null)
        }
    }

    const handleUpdateClient = (updatedClient: Client) => {
        setClients(clients.map((c) => (c.id === updatedClient.id ? updatedClient : c)))
        setSelectedClient(updatedClient)
    }

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader title="Client Management" description="Manage all client data and credentials" />

            <div className="p-6">
                <div className="mb-4 flex justify-end">
                    <Button
                        onClick={() => setShowNewClientForm(true)}
                        className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        <Plus className="w-4 h-4" />
                        Add Client
                    </Button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-muted-foreground">Cargando clientes...</div>
                ) : (
                    <DataGridView
                        clients={clients}
                        onSelectClient={setSelectedClient}
                        selectedClientId={selectedClient?.id}
                        onDeleteClient={handleDeleteClient}
                    />
                )}
            </div>

            {/* New Client Form Modal */}
            {showNewClientForm && <NewClientForm onClose={() => setShowNewClientForm(false)} onAdd={handleAddClient} />}

            {/* Card View Modal */}
            {selectedClient && (
                <CardView
                    client={selectedClient}
                    onClose={() => setSelectedClient(null)}
                    isAdmin={isAdmin}
                    onUpdate={handleUpdateClient}
                />
            )}
        </div>
    )
}
