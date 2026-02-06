import { toast } from "sonner";
import { AxiosError } from "axios";

export const handleApiError = (
  error: unknown,
  errorMessage: string = "Ha ocurrido un error inesperado",
) => {
  if (typeof window === "undefined") return;

  if (error instanceof AxiosError) {
    const status = error.response?.status;

    if (status === 401) {
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

    if (status === 400) {
      const detail =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Datos inválidos";
      toast.error("Error de Validación", {
        description: detail,
        position: "bottom-right",
      });
      return;
    }

    if (status === 403) {
      window.location.href = "/error/403";
      return;
    }
  }

  console.error(error);
  toast.error("Error", { description: errorMessage, position: "bottom-right" });
};

export const handleApiSuccess = (message: string = "Operación exitosa") => {
  toast.success("Éxito", { description: message, position: "bottom-right" });
};
