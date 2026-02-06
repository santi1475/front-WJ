import { toast } from "sonner";

export const launchSunatLogin = (
  ruc: string,
  usuario: string,
  clave: string,
) => {
  if (!ruc || !usuario || !clave) {
    console.error("Faltan credenciales para el autologin SUNAT");
    toast.error("Error: Faltan credenciales (RUC, Usuario o Clave)", {
      position: "bottom-right",
    });
    return;
  }

  if (typeof window === "undefined") {
    return;
  }

  const sunatUrl = "https://e-menu.sunat.gob.pe/cl-ti-itmenu/MenuInternet.htm";

  const loginData = {
    url: sunatUrl,
    credenciales: {
      ruc: ruc,
      usuario: usuario.toUpperCase(),
      clave: clave,
    },
    tipo: "SUNAT_SOL",
  };

  const event = new CustomEvent("WJ_LOGIN_REQUEST", { detail: loginData });
  document.dispatchEvent(event);

  console.log("Evento WJ_LOGIN_REQUEST enviado al DOM (document).");
  toast.success("Iniciando extensión de autologin...", {
    duration: 2000,
    position: "bottom-right",
  });
};
