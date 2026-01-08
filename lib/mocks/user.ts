import type { User } from "@/lib/types/user"

export const currentUser: User = {
  id: "1",
  name: "Carlos Mendoza",
  email: "carlos.mendoza@empresahub.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
  role: "admin",
  department: "Administración",
}

export const users: User[] = [
  {
    id: "1",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@empresahub.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    role: "admin",
    department: "Administración",
  },
  {
    id: "2",
    name: "María García",
    email: "maria.garcia@empresahub.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    role: "contador",
    department: "Contabilidad",
  },
  {
    id: "3",
    name: "Juan López",
    email: "juan.lopez@empresahub.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
    role: "usuario",
    department: "Operaciones",
  },
]
