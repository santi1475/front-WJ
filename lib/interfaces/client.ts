export interface Client {
    id: string
    name?: string
    email?: string
    razonSocial: string
    ruc : string
    responsable: string
    categoria: string
    propietario: string
    fechaIngreso: string
    claveSol: string
    solUser: string
    status: "Activo" | "Inactivo"
    accountsCount?: number
    lastUpdated?: string
}

export interface ClientsTableProps {
    clients: Client[]
    loading: boolean
}