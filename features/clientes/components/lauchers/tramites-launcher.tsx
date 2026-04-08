import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { launchPortalLogin } from '../../services/portal-launcher.service';
import { LauncherConfig } from '@/lib/interfaces/lauchers';


const SUNAT_URL = "https://api-seguridad.sunat.gob.pe/v1/clientessol/4f3b88b3-d9d6-402a-b85d-6a0bc857746a/oauth2/loginMenuSol?lang=es-PE&showDni=true&showLanguages=false&originalUrl=https://e-menu.sunat.gob.pe/cl-ti-itmenu/AutenticaMenuInternet.htm&state=rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAADZXhlcHQABnBhcmFtc3QASyomKiYvY2wtdGktaXRtZW51L01lbnVJbnRlcm5ldC5odG0mYjY0ZDI2YThiNWFmMDkxOTIzYjIzYjY0MDdhMWMxZGI0MWU3MzNhNnQABGV4ZWNweA==";

export const TramitesLauncher: React.FC<LauncherConfig> = ({ ruc, usuario, clave, disabled }) => {

    const handleLogin = (e: React.MouseEvent) => {
        e.preventDefault();
        if (ruc && usuario && clave) {
            launchPortalLogin({
                ruc, usuario, clave
            }, {
                url: SUNAT_URL,
                portalName: "SUNAT"
            });
        }
    };

    const isDisabled = disabled || !ruc || !usuario || !clave;

    return (
        <Button
            onClick={handleLogin}
            disabled={isDisabled}
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3 px-4 group"
            title={isDisabled ? "Faltan credenciales" : "Ir al Portal SOL"}
        >
            <div className="relative w-5 h-5 shrink-0 rounded-md overflow-hidden border border-primary">
                <Image
                    src="/sunat-logo.svg"
                    alt="SUNAT Logo"
                    fill
                    className="object-contain"
                />
            </div>
            <div className="flex flex-col items-start">
                <span className="font-semibold text-sm">Mis Trámites y Consultas</span>
            </div>
        </Button>
    );
};
