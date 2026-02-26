import { LoginForm } from "@/features/auth/components/login-form"
import { AuthGuard } from "@/components/auth-guard"

export const metadata = {
    title: "Login - Contable System",
    description: "Inicia sesión en el sistema contable",
}

export default function LoginPage() {
    return (
        <AuthGuard>
            <LoginForm />
        </AuthGuard>
    )
}
