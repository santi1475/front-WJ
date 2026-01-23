import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { launchSunatLogin } from '../services/sunat-launcher.service';

interface SunatLauncherProps {
    ruc?: string;
    usuario?: string;
    clave?: string; 
    className?: string;
    disabled?: boolean;
}

export const SunatLauncher: React.FC<SunatLauncherProps> = ({ ruc, usuario, clave, className, disabled }) => {

    const handleLogin = (e: React.MouseEvent) => {
        e.preventDefault();
        if (ruc && usuario && clave) {
            launchSunatLogin(ruc, usuario, clave);
        }
    };

    const isDisabled = disabled || !ruc || !usuario || !clave;

    return (
        <Button
            onClick={handleLogin}
            disabled={isDisabled}
            variant="secondary"
            size="sm"
            className={`${className || ""} flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white border border-slate-600`}
            title={isDisabled ? "Faltan credenciales" : "Ir al Portal SOL"}
            type="button"
        >
            <div className="relative w-5 h-5 flex-shrink-0">
                <Image
                    src="/sunat-logo.svg"
                    alt="SUNAT Logo"
                    fill
                    className="object-contain"
                />
            </div>
        </Button>
    );
};
