import { toast } from "sonner";
import { AxiosError } from "axios";

export const handleApiError = (
  error: unknown,
  errorMessage: string = "Ha ocurrido un error inesperado",
) => {
  if (typeof window === "undefined") return;

  if (error instanceof AxiosError) {
    const status = error.response?.status;

    // Errores Críticos -> Redirección a Status Pages
    if (status === 401) {
      // Check if it's an expiration vs just unauthorized
      // For simplicity, we might redirect to login, but user asked for status pages usage.
      // If the axios interceptor already handles token refresh failures by redirecting to login,
      // we should be careful.
      // Let's assume if we reach here, it's a hard 401 that wasn't refreshed.
      // window.location.href = "/error/expired"; // Or 401
      // Use session expired page if it seems like a session issue, or 401 for generic
      window.location.href = "/error/expired";
      return;
    }
    if (status === 404) {
      window.location.href = "/error/404";
      return;
    }
    if (status === 500) {
      window.location.href = "/error/500";
      return;
    }
    if (status === 502) {
      window.location.href = "/error/502";
      return;
    }
    if (status === 503) {
      window.location.href = "/error/503";
      return;
    }

    // Errores de Validación o Bad Request -> Sonner Toast
    if (status === 400) {
      const detail =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Datos inválidos";
      toast.error("Error de Validación", { description: detail });
      return;
    }

    if (status === 403) {
      toast.error("Acceso Denegado", {
        description: "No tienes permisos para realizar esta acción.",
      });
      return;
    }
  }

  // Default Fallback
  console.error(error);
  toast.error("Error", { description: errorMessage });
};

export const handleApiSuccess = (message: string = "Operación exitosa") => {
  toast.success("Éxito", { description: message });
};
