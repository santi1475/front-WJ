import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { launchPortalLogin } from '../services/portal-launcher.service';

interface SunafilLauncherProps {
    ruc?: string;
    usuario?: string;
    clave?: string;
    className?: string;
    disabled?: boolean;
}

const SUNAFIL_URL = "https://api-seguridad.sunat.gob.pe/v1/clientessol/b6474e23-8a3b-4153-b301-dafcc9646250/oauth2/login?originalUrl=https://casillaelectronica.sunafil.gob.pe/si.inbox/Login/Empresa&state=s";

export const SunafilLauncher: React.FC<SunafilLauncherProps> = ({ ruc, usuario, clave, className, disabled }) => {

    const handleLogin = (e: React.MouseEvent) => {
        e.preventDefault();
        if (ruc && usuario && clave) {
            launchPortalLogin({
                ruc, usuario, clave
            }, {
                url: SUNAFIL_URL,
                portalName: "SUNAFIL"
            });
        }
    };

    const isDisabled = disabled || !ruc || !usuario || !clave;

    return (
        <Button
            onClick={handleLogin}
            disabled={isDisabled}
            size="sm"
            className={`${className || ""} flex items-center gap-2 bg-slate-300 hover:bg-slate-200 text-slate-900 border border-slate-600`}
            title={isDisabled ? "Faltan credenciales" : "Ir a Casilla SUNAFIL"}
            type="button"
        >
            <div className="relative w-5 h-5 shrink-0">
                <Image
                    src="/sunafil-logo.svg"
                    alt="SUNAFIL Logo"
                    fill
                    className="object-contain"
                />
            </div>
        </Button>
    );
};
