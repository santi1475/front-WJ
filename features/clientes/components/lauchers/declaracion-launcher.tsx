import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { launchPortalLogin } from '../../services/portal-launcher.service';
import { LauncherConfig } from '@/lib/interfaces/lauchers';

const SUNAT_URL = "https://api-seguridad.sunat.gob.pe/v1/clientessol/03590141-c69c-438c-a36a-8ee2a3ad9747/oauth2/login?originalUrl=https://e-renta.sunat.gob.pe/loader/recaudaciontributaria/declaracionpago/formularios"
export const DeclaracionLauncher: React.FC<LauncherConfig> = ({ ruc, usuario, clave, disabled }) => {

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
                <span className="font-semibold text-sm">Declara Renta Anual</span>
            </div>
        </Button>
    );
};
