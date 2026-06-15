"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
interface Pedido {
  id: string;
  created_at: string;
  nombre: string;
  whatsapp: string;
  correo: string;
  descripcion: string;
}

export default function AdminPanel() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarPedidos() {
      const { data, error } = await supabase
        .from('pedidos_3d')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setPedidos(data);
      setLoading(false);
    }
    cargarPedidos();
  }, []);

  if (loading) return <div className="text-center p-20 text-zinc-400">Cargando panel...</div>;

  return (
    <div className="min-h-screen bg-black text-zinc-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Bandeja de Clientes</h1>
            <p className="text-zinc-500 text-sm mt-1">Busca los archivos en tu email usando el correo del usuario.</p>
          </div>
          <span className="text-xs font-mono bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full text-zinc-400">
            Total: {pedidos.length} registros
          </span>
        </div>
        
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="text-lg font-bold text-zinc-100">{pedido.nombre}</h3>
                  <span className="text-xs text-zinc-500 font-mono">
                    {new Date(pedido.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs text-amber-500 font-medium tracking-wide">
                  Email: <span className="text-zinc-300 font-normal select-all">{pedido.correo}</span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed pt-1">{pedido.descripcion}</p>
              </div>

              {/* Acciones */}
              <div className="flex md:flex-col lg:flex-row gap-3 h-fit w-full md:w-auto">
                <a
                  href={`whatsapp://send?phone=${pedido.whatsapp}&text=Hola%20${encodeURIComponent(pedido.nombre)}!%20Vi%20tu%20solicitud%20en%20la%20web%20y%20estoy%20revisando%20el%20archivo%203D%20que%20me%20lleg%C3%B3%20por%20mail.`}
                  className="flex-1 md:flex-none text-center px-4 py-2.5 bg-amber-500 rounded-lg text-sm font-bold text-black hover:bg-amber-400 transition-colors whitespace-nowrap"
                >
                  Hablar por WhatsApp
                </a>
              </div>
            </div>
          ))}
          
          {pedidos.length === 0 && (
            <p className="text-zinc-500 text-center py-16 border border-dashed border-zinc-900 rounded-xl">No hay registros de clientes aún.</p>
          )}
        </div>
      </div>
    </div>
  );
}
