import React from 'react';
import { Button } from "@/components/ui/button";
import { launchPortalLogin } from '../../services/portal-launcher.service';
import { Building2 } from 'lucide-react';

interface AfpLauncherProps {
    ruc?: string;
    usuario?: string;
    clave?: string;
    className?: string;
    disabled?: boolean;
}

const AFP_URL = "https://www.afpnet.com.pe/";

export const AfpLauncher: React.FC<AfpLauncherProps> = ({ ruc, usuario, clave, className, disabled }) => {

    const handleLogin = (e: React.MouseEvent) => {
        e.preventDefault();
        if (ruc && usuario && clave) {
            launchPortalLogin({
                ruc, usuario, clave
            }, {
                url: AFP_URL,
                portalName: "AFP NET",
                skipSubmit: true,
                openInTab: true,
                selectors: {
                    ruc: "#NumeroDocumento",
                    usuario: "#NombreUsuario",
                    clave: "#Contrasenia"
                }
            });
        }
    };

    const isDisabled = disabled || !ruc || !usuario || !clave;

    return (
        <Button
            onClick={handleLogin}
            disabled={isDisabled}
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3 px-4 bg-blue-700 hover:bg-blue-600 text-white border border-blue-600 font-bold"
            title={isDisabled ? "Faltan credenciales" : "Ir a AFP Net"}
        >
            <div className="relative w-5 h-5 shrink-0 rounded-md overflow-hidden">
                <Building2 className="w-4 h-4 dark:text-blue-600" />
            </div>
            <div className="flex flex-col items-start">
                <span className="font-semibold text-sm">AFP Net</span>
            </div>
        </Button>
    );
};
