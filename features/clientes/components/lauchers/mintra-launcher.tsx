import React from 'react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { launchPortalLogin } from '../../services/portal-launcher.service';
import { LauncherConfig } from '@/lib/interfaces/lauchers';

const MITRA_URL = "https://api-seguridad.sunat.gob.pe/v1/clientessol/cf23edbf-6092-49b4-a144-497184c67b34/oauth2/login?originalUrl=https://apps.trabajo.gob.pe/pasclavesol/sunat/oauth&state=m1ntr4";

export const MitraLauncher: React.FC<LauncherConfig> = ({ ruc, usuario, clave, disabled }) => {

    const handleLogin = (e: React.MouseEvent) => {
        e.preventDefault();
        if (ruc && usuario && clave) {
            launchPortalLogin({
                ruc, usuario, clave
            }, {
                url: MITRA_URL,
                portalName: "MITRA"
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
            title={isDisabled ? "Faltan credenciales" : "Ir a MITRA (Min. Trabajo)"}
        >
            <div className="relative w-5 h-5 shrink-0 rounded-md overflow-hidden border border-primary">
                <Image
                    src="/mintra-logo.svg"
                    alt="MITRA Logo"
                    fill
                    className="object-contain"
                />
            </div>
            <div className="flex flex-col items-start">
                <span className="font-semibold text-sm">MITRA (Min. Trabajo)</span>
            </div>
        </Button>
    );
};
