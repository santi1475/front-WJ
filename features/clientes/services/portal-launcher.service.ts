import { toast } from "sonner";

export interface PortalCredentials {
  ruc: string;
  usuario: string;
  clave: string;
}

export interface PortalConfig {
  url: string;
  portalName: string; // Ex: "SUNAT", "SUNAFIL"
  selectors?: {
    ruc: string;
    usuario: string;
    clave: string;
    submit: string;
  };
}

const DEFAULT_SELECTORS = {
  ruc: "#txtRuc",
  usuario: "#txtUsuario",
  clave: "#txtContrasena",
  submit: "#btnAceptar",
};

export const launchPortalLogin = (
  credentials: PortalCredentials,
  config: PortalConfig,
) => {
  const { ruc, usuario, clave } = credentials;

  if (!ruc || !usuario || !clave) {
    console.error(`Faltan credenciales para el autologin ${config.portalName}`);
    toast.error(`Error: Faltan credenciales para ${config.portalName}`, {
      position: "bottom-right",
    });
    return;
  }

  if (typeof window === "undefined") {
    return;
  }

  const selectors = { ...DEFAULT_SELECTORS, ...config.selectors };

  // Definir pasos de automatización
  const pasos = [
    { selector: selectors.ruc, accion: "escribir", valor: ruc },
    {
      selector: selectors.usuario,
      accion: "escribir",
      valor: usuario.toUpperCase(),
    },
    { selector: selectors.clave, accion: "escribir", valor: clave },
    { selector: selectors.submit, accion: "click", valor: "" },
  ];

  const loginData = {
    url: config.url,
    pasos: pasos,
  };

  // Escuchar respuesta de la extensión
  const statusHandler = (e: Event) => {
    const customEvent = e as CustomEvent;
    const { type, message } = customEvent.detail;
    const toastId = `${config.portalName.toLowerCase()}-login-status`;

    if (type === "INFO") {
      toast.info(message, { id: toastId });
    } else if (type === "SUCCESS") {
      toast.success(message, { id: toastId, duration: 5000 });
      document.removeEventListener("WJ_LOGIN_STATUS", statusHandler);
    } else if (type === "ERROR") {
      toast.error(message, { id: toastId, duration: 5000 });
      document.removeEventListener("WJ_LOGIN_STATUS", statusHandler);
    }
  };

  document.addEventListener("WJ_LOGIN_STATUS", statusHandler);

  setTimeout(() => {
    document.removeEventListener("WJ_LOGIN_STATUS", statusHandler);
  }, 30000);

  const event = new CustomEvent("WJ_LOGIN_REQUEST", { detail: loginData });
  document.dispatchEvent(event);

  console.log(`Evento WJ_LOGIN_REQUEST enviado para ${config.portalName}.`);
  toast.loading(`Conectando con extensión para ${config.portalName}...`, {
    id: `${config.portalName.toLowerCase()}-login-status`,
    position: "bottom-right",
  });
};
