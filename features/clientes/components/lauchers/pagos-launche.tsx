import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { launchPortalLogin } from '../../services/portal-launcher.service';

interface PagosLauncherProps {
    ruc?: string;
    usuario?: string;
    clave?: string;
    className?: string;
    disabled?: boolean;
}

const PAGOS_URL = "https://api-seguridad.sunat.gob.pe/v1/clientessol/59d39217-c025-4de5-b342-393b0f4630ab/oauth2/loginMenuSol?lang=es-PE&showDni=true&showLanguages=false&originalUrl=https://e-menu.sunat.gob.pe/cl-ti-itmenu2/AutenticaMenuInternetPlataforma.htm&state=rO0ABXQA7HpIam90dXJFVVlqQlpNb2t3NE8xQUZiZFBYdG5qZlhKbzVRQ3k0TnBZZ0lWNWhBNDU4OTZWU2xUbU85V1pVa2gvQUU2N09OR1VPR0M2d2g1YTBmMkxlOGpZQWNiazcyVXkweEhkTU44QWQrNVJCYUJURkgvcHdPRkxGZkplSTN5dkFESjdBSXZXM2lZbkZOc2NwMWNsbWJ2c1pXeUJQVnNIOEdERklJZWFCd1AvRFFVTFcraGRoeGk0YTczVC9pS3Z0Vmd1WVBqODlJckN3LzViaE5LelBmcnNqcURTNHdNOVYvTitvYTVyVmM9";

export const PagosLauncher: React.FC<PagosLauncherProps> = ({ ruc, usuario, clave, className, disabled }) => {

    const handleLogin = (e: React.MouseEvent) => {
        e.preventDefault();
        if (ruc && usuario && clave) {
            launchPortalLogin({
                ruc, usuario, clave
            }, {
                url: PAGOS_URL,
                portalName: "SUNAT-PAGOS"
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
            title={isDisabled ? "Faltan credenciales" : "Ir a Mis Declaraciones y Pagos"}
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
                <span className="font-semibold text-sm">Mis Declaraciones y Pagos</span>
            </div>
        </Button>
    );
};
