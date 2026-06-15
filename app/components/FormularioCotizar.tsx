'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inicializa Supabase leyendo de forma segura las variables de entorno
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

        // Extraemos las variables independientes limpias para la base de datos
        const nombre = formData.get('nombre') as string;
        const whatsapp = formData.get('whatsapp') as string;
        const correo = formData.get('email') as string; // Captura el input name="email"
        const descripcion = formData.get('descripcion') as string;
        const archivoFisico = formData.get('archivo3d') as File;

        try {
            // 1. Subir el archivo 3D a tu bucket público de Supabase Storage
            const nombreArchivo = `${Date.now()}-${archivoFisico.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('modelos-clientes')
                .upload(nombreArchivo, archivoFisico);

            if (uploadError) throw uploadError;

            // 2. Obtener la URL de descarga directa generada por tu Storage público
            const { data: { publicUrl } } = supabase.storage
                .from('modelos-clientes')
                .getPublicUrl(nombreArchivo);

            // 3. Guardar TODOS los datos (incluyendo la URL) en la Base de Datos
            const { error: dbError } = await supabase
                .from('pedidos_3d')
                .insert([{ nombre, whatsapp, correo, descripcion, archivo_url: publicUrl }]);

            if (dbError) throw dbError;

            // Si todo impactó con éxito en Supabase, mostramos el cartel verde
            setStatus('success');
            formElement.reset();

        } catch (error) {
            console.error("Error en el flujo de Supabase:", error);
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
                    Envía tu pedido 3D
                </h2>
                <p className="text-zinc-400 mt-2 text-sm">
                    Los datos y el modelo se registrarán en nuestro sistema para ser evaluados de inmediato.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-950 p-8 rounded-2xl border border-zinc-900 shadow-2xl">
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

                {/* Correo Electrónico */}
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
                        Archivo (.STL, .OBJ, .ZIP o imagen .PNG, .JPG)
                    </label>
                    <div className="relative flex items-center justify-center w-full bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-xl p-6 hover:border-amber-500/50 transition-colors group cursor-pointer">
                        <input
                            type="file"
                            name="archivo3d"
                            id="archivo3d"
                            required
                            accept=".stl,.obj,.step,.glb,.3ds,.zip,.png,.jpg"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="text-center pointer-events-none">
                            <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors text-sm block font-medium">
                                Selecciona o arrastra tu archivo aquí
                            </span>
                            <span className="text-zinc-600 text-xs block mt-1">
                                Se almacenará de forma segura en nuestro servidor
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
                        ¡Pedido registrado con éxito! Gracias por tu confianza.
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
