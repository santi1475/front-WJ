const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID;
import { toast } from "sonner";

export const launchSunatLogin = (
  ruc: string,
  usuario: string,
  clave: string,
) => {
  if (!EXTENSION_ID) {
    console.error(
      "ERROR CRÍTICO: No se ha configurado NEXT_PUBLIC_EXTENSION_ID en el archivo .env",
    );
    toast.error("Error de configuración del sistema. Contacte a soporte de AlphaTech.");
    return;
  }

  if (!ruc || !usuario || !clave) {
    console.error("Faltan credenciales para el autologin SUNAT");
    toast.error("Error: Faltan credenciales (RUC, Usuario o Clave)");
    return;
  }

  if (typeof window === "undefined") {
    return;
  }

  const sunatUrl = "https://e-menu.sunat.gob.pe/cl-ti-itmenu/MenuInternet.htm";

  const message = {
    action: "START_LOGIN",
    payload: {
      url: sunatUrl,
      credenciales: {
        ruc: ruc,
        usuario: usuario.toUpperCase(),
        clave: clave,
      },
      tipo: "SUNAT_SOL",
    },
  };

  if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage(EXTENSION_ID, message, (response) => {
      if (chrome.runtime.lastError) {
        console.warn(
          "No se pudo conectar con la extensión:",
          chrome.runtime.lastError.message,
        );
        toast.error(
          "La extensión no respondió. Verifica que el ID en el .env sea correcto y la extensión esté activa.",
        );
      } else {
        console.log("Comando enviado exitosamente a la extensión.");
      }
    });
  } else {
    console.warn("API de Chrome no detectada.");
    toast.error(
      "Para usar el inicio de sesión automático, necesitas instalar la extensión WJ AutoLogin.",
    );
  }
};
