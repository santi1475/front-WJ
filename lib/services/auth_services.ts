// services/auth.service.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface LoginResponse {
    access: string;
    refresh: string;
}

export const authService = {
    async login(username: string, password: string): Promise<LoginResponse> {
        if (!API_URL) {
            throw new Error("La URL de la API no está configurada");
        }

        try {
            const res = await fetch(`${API_URL}/api/auth/token/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                if (res.status === 401) throw new Error("Usuario o contraseña incorrectos");
                throw new Error("Error de conexión con el servidor");
            }

            const data = await res.json();
            return data;
        } catch (error) {
            console.error("Error en authService:", error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    },

    getToken() {
        if (typeof window !== "undefined") {
            return localStorage.getItem("accessToken");
        }
        return null;
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};