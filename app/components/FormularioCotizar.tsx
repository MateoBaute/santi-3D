'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inicializa Supabase (reemplaza con tus credenciales)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function FormularioCotizar() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');

        const formElement = e.currentTarget;
        const formData = new FormData(formElement);
        formData.append("access_key", "1e26f8c6-1466-42a3-abb2-4973483886b5");

        const nombre = formData.get('nombre') as string;
        const whatsapp = formData.get('whatsapp') as string;
        const correo = formData.get('email') as string;
        const descripcion = formData.get('descripcion') as string;

        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            const { error: dbError } = await supabase
                .from('pedidos_3d')
                .insert([{ nombre, whatsapp, correo, descripcion }]);

            if (dbError) throw dbError;

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setStatus('success');
                formElement.reset();
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <section id="cotizar" className="max-w-xl mx-auto py-20 px-6 w-full text-zinc-50">
            <div className="text-center mb-10">
                <span className="text-sm font-semibold tracking-wider uppercase text-amber-500 block mb-2">
                    Cotización Sin Cargo
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Sube tu proyecto 3D
                </h2>
                <p className="text-zinc-400 mt-2 text-sm">
                    Los datos se registrarán en nuestro sistema y el archivo llegará directo a nuestro correo.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-950 p-8 rounded-2xl border border-zinc-900 shadow-2xl">
                {/* Tu Access Key de Web3Forms oculta */}
                <input type="hidden" name="access_key" value="1e26f8c6-1466-42a3-abb2-4973483886b5" />

                {/* Nombre */}
                <div>
                    <label htmlFor="nombre" className="block text-xs font-semibold tracking-wider uppercase text-zinc-400 mb-2">
                        Nombre Completo
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        id="nombre"
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                        placeholder="Ej. Juan Pérez"
                    />
                </div>

                {/* WhatsApp */}
                <div>
                    <label htmlFor="whatsapp" className="block text-xs font-semibold tracking-wider uppercase text-zinc-400 mb-2">
                        Número de WhatsApp
                    </label>
                    <input
                        type="tel"
                        name="whatsapp"
                        id="whatsapp"
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                        placeholder="Ej. +598 12 345 678"
                    />
                </div>

                {/* Correo Electrónico (Atributo name corregido a 'email' para Web3Forms y anti-spam) */}
                <div>
                    <label htmlFor="correo" className="block text-xs font-semibold tracking-wider uppercase text-zinc-400 mb-2">
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="correo"
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                        placeholder="juan@ejemplo.com"
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label htmlFor="descripcion" className="block text-xs font-semibold tracking-wider uppercase text-zinc-400 mb-2">
                        Detalles del pedido
                    </label>
                    <textarea
                        name="descripcion"
                        id="descripcion"
                        rows={4}
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors text-sm resize-none"
                        placeholder="Especifica material, color o dimensiones necesarias..."
                    />
                </div>

                {/* Archivo 3D */}
                <div>
                    <label htmlFor="archivo3d" className="block text-xs font-semibold tracking-wider uppercase text-zinc-400 mb-2">
                        Archivo 3D (.STL, .OBJ, .STEP, .3DS o archivos comprimidos .ZIP)
                    </label>
                    <div className="relative flex items-center justify-center w-full bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-xl p-6 hover:border-amber-500/50 transition-colors group cursor-pointer">
                        <input
                            type="file"
                            name="archivo3d"
                            id="archivo3d"
                            required
                            accept=".stl,.obj,.step,.glb,.3ds,.zip"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="text-center pointer-events-none">
                            <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors text-sm block font-medium">
                                Selecciona o arrastra tu archivo aquí
                            </span>
                            <span className="text-zinc-600 text-xs block mt-1">
                                Llegará directo a nuestro email
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{ touchAction: 'manipulation' }}
                    className="w-full py-4 text-center font-bold text-sm uppercase tracking-wider text-black bg-zinc-50 hover:bg-amber-500 rounded-xl transition-all duration-300 disabled:bg-zinc-800 disabled:text-zinc-600"
                >
                    {status === 'loading' ? 'Procesando Pedido...' : 'Enviar Solicitud'}
                </button>

                {status === 'success' && (
                    <p className="text-center text-sm font-medium text-emerald-500 bg-emerald-500/10 py-3 rounded-xl border border-emerald-500/20">
                        ¡Pedido registrado! El archivo fue enviado al correo.
                    </p>
                )}
                {status === 'error' && (
                    <p className="text-center text-sm font-medium text-rose-500 bg-rose-500/10 py-3 rounded-xl border border-rose-500/20">
                        Hubo un problema. Por favor verifica los datos.
                    </p>
                )}
            </form>
        </section>
    );
}
