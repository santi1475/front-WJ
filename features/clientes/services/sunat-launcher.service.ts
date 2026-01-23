export const launchSunatLogin = (
  ruc: string,
  usuario: string,
  clave: string,
) => {
  if (!ruc || !usuario || !clave) {
    console.error("Faltan credenciales para el autologin SUNAT");
    alert("Error: Faltan credenciales (RUC, Usuario o Clave)");
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
    tipo: "SUNAT_SOL"
  };

  const event = new CustomEvent("BUZONE_LOGIN_REQUEST", {
    detail: loginData,
  });

  try {
    document.dispatchEvent(event);
    console.log("Evento enviado a la extensión:", loginData);
    console.log("La extensión abrirá la pestaña y llenará los campos automáticamente.");
  } catch (error) {
    console.error("Error al enviar evento a la extensión:", error);
    alert(
      "Error al comunicarse con la extensión. Asegúrate de que la extensión esté instalada y activa.",
    );
  }
};
