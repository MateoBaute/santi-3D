'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Inicialización de Supabase con tus variables de entorno
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function FAQs() {
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

        try {
            // Guardar los datos en tu tabla específica de Supabase
            // NOTA: Asegurate de cambiar 'faqs_clientes' por el nombre real de tu tabla si es otro
            const { error: dbError } = await supabase
                .from('faqs_clientes') 
                .insert([{ nombre, whatsapp, correo, descripcion }]);

            if (dbError) throw dbError;

            // Si todo impactó con éxito en Supabase, mostramos el cartel verde
            setStatus('success');
            formElement.reset();

            // Opcional: Volver al estado inicial después de 5 segundos
            setTimeout(() => setStatus('idle'), 5000);

        } catch (error) {
            console.error("Error en el flujo de Supabase:", error);
            setStatus('error');
        }
    };

    return (
        <div>
            <div className="text-center mt-10 mb-4">
                <span className="text-sm font-semibold tracking-wider uppercase text-amber-500">
                    Preguntas Frecuentes
                </span>
                <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
                    Aquí puedes dejar algunas de tus preguntas.
                </p>
            </div>

            <section id="FAQs" className="max-w-xl mx-auto py-0 px-6 w-full text-zinc-50">
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
                            Detalle su duda
                        </label>
                        <textarea
                            name="descripcion"
                            id="descripcion"
                            rows={4}
                            required
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors text-sm resize-none"
                            placeholder="¿Como envío el modelo que quiero cotizar?"
                        />
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
        </div>
    )
}
