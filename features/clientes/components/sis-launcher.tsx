import React from 'react';
import { Button } from "@/components/ui/button";
import { launchPortalLogin } from '../services/portal-launcher.service';
import { HeartPulse } from 'lucide-react';

interface SisLauncherProps {
    ruc?: string;
    className?: string;
    disabled?: boolean;
}

const SIS_URL = "http://app.sis.gob.pe/SIS_MYPES_1/frmLogin.aspx";

export const SisLauncher: React.FC<SisLauncherProps> = ({ ruc, className, disabled }) => {

    const handleLogin = (e: React.MouseEvent) => {
        e.preventDefault();
        if (ruc) {
            launchPortalLogin({
                ruc: "",
                usuario: ruc,
                clave: ""
            }, {
                url: SIS_URL,
                portalName: "SIS",
                skipSubmit: true,
                openInTab: true,
                selectors: {
                    usuario: "#txtUsuario"
                }
            });
        }
    };

    const isDisabled = disabled || !ruc;

    return (
        <Button
            onClick={handleLogin}
            disabled={isDisabled}
            variant="secondary"
            size="sm"
            className={`${className || ""} flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 font-bold`}
            title={isDisabled ? "Falta RUC del cliente" : "Ir al SIS"}
            type="button"
        >
            <HeartPulse className="w-4 h-4" />
            <span className="text-xs">SIS</span>
        </Button>
    );
};
