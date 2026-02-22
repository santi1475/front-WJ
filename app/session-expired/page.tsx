"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, ShieldAlert, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SessionExpiredPage() {
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        // Redirigir automáticamente después de 10 segundos
        const countdownTimer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownTimer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdownTimer);
    }, []);

    useEffect(() => {
        if (countdown === 0 && !isRedirecting) {
            handleRedirect();
        }
    }, [countdown, isRedirecting]);

    const handleRedirect = () => {
        setIsRedirecting(true);
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            {/* Círculo animado de fondo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl text-center z-10 animate-in fade-in zoom-in duration-500">

                {/* Ícono de alerta */}
                <div className="mx-auto w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center mb-6">
                    <ShieldAlert className="w-10 h-10 text-indigo-400" />
                </div>

                {/* Título y Mensaje */}
                <h1 className="text-2xl font-bold tracking-tight text-white mb-3">
                    Sesión Expirada
                </h1>
                <p className="text-slate-400 mb-8 leading-relaxed">
                    Por tu seguridad y para proteger tu información, hemos cerrado tu sesión debido a un largo periodo de inactividad o porque tus credenciales de acceso han vencido.
                </p>

                {/* Detalles Técnicos */}
                <div className="bg-slate-950/50 rounded-xl p-4 mb-8 flex items-center justify-center gap-3 border border-slate-800/50">
                    <Clock className="w-5 h-5 text-slate-500" />
                    <span className="text-sm font-medium text-slate-300">
                        Redirigiendo en {countdown} segundos...
                    </span>
                </div>

                {/* Botón de Acción */}
                <Button
                    onClick={handleRedirect}
                    disabled={isRedirecting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-base shadow-lg shadow-indigo-900/20"
                >
                    {isRedirecting ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Conectando...
                        </>
                    ) : (
                        <>
                            Volver a Iniciar Sesión
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                    )}
                </Button>
            </div>

            <div className="mt-8 text-center text-slate-600 text-xs z-10">
                <p>Vuelve a ingresar con tus credenciales habituales.</p>
                <p className="mt-1">Sistema de Gestión WJ &copy; {new Date().getFullYear()}</p>
            </div>
        </div>
    );
}
