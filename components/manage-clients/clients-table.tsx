import { ClientsTableProps } from "@/lib/interfaces/client"

export default function ClientsTable({ clients, loading }: ClientsTableProps) {
    if (loading) {
        return <div className="text-center py-8 text-muted-foreground">Loading clients...</div>
    }

    return (
        <div className="overflow-x-auto ">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Client Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Accounts</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Last Updated</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <tr key={client.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                            <td className="py-3 px-4 text-card-foreground font-medium">{client.name}</td>
                            <td className="py-3 px-4 text-muted-foreground">{client.email}</td>
                            <td className="py-3 px-4">
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${client.status === "Activo" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {client.status}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-card-foreground">{client.accountsCount}</td>
                            <td className="py-3 px-4 text-muted-foreground">{client.lastUpdated}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
