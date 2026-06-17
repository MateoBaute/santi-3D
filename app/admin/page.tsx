"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

import Login from '@/app/components/admin/login'

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
  archivo_url?: string;
}

export default function AdminPanel() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState<boolean>(false)

  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
  const [mostrarSheet, setMostrarSheet] = useState(false);

  async function cargarPedidos() {
    const { data, error } = await supabase
      .from('pedidos_3d')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setPedidos(data);
    setLoading(false);
  }

  useEffect(() => {
    cargarPedidos();
  }, []);

  useEffect(() => {
    const manejarTeclaEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mostrarSheet) {
        cerrarSheet();
      }
    };
    window.addEventListener("keydown", manejarTeclaEscape);
    return () => window.removeEventListener("keydown", manejarTeclaEscape);
  }, [mostrarSheet]);

  const abrirPedido = (pedido: Pedido) => {
    setPedidoSeleccionado(pedido);
    setTimeout(() => setMostrarSheet(true), 10);
  };

  const cerrarSheet = () => {
    setMostrarSheet(false);
    setTimeout(() => setPedidoSeleccionado(null), 300);
  };

  // FUNCIÓN PRINCIPAL PARA BORRAR ARCHIVO Y REGISTRO
  const eliminarPedido = async (pedido: Pedido) => {
    const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar el pedido de "${pedido.nombre}"? Esto liberará espacio en el Storage.`);
    if (!confirmar) return;

    setEliminandoId(pedido.id);

    try {
      // 1. Si el pedido tiene un archivo asociado, lo borramos del Storage
      if (pedido.archivo_url) {
        // Extraemos el nombre del archivo de la URL (lo que va después de /modelos-clientes/)
        const partesUrl = pedido.archivo_url.split('/modelos-clientes/');
        if (partesUrl.length > 1) {
          const nombreArchivo = partesUrl[1];

          const { error: storageError } = await supabase.storage
            .from('modelos-clientes')
            .remove([nombreArchivo]);

          if (storageError) console.error("Error al borrar del Storage:", storageError);
        }
      }

      // 2. Borramos la fila correspondiente de la base de datos
      const { error: dbError } = await supabase
        .from('pedidos_3d')
        .delete()
        .eq('id', pedido.id);

      if (dbError) throw dbError;

      // 3. Cerramos el panel lateral y refrescamos la interfaz web
      cerrarSheet();
      await cargarPedidos();

    } catch (error) {
      console.error("Error al eliminar por completo:", error);
      alert("Hubo un error al intentar eliminar el pedido.");
    } finally {
      setEliminandoId(null);
    }
  };

  if (loading) return <div className="text-center p-20 text-zinc-400">Cargando panel...</div>;

  return (
    <div className="min-h-screen bg-black text-zinc-50 p-8 font-sans relative overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        <Login />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Bandeja de Clientes</h1>
            <p className="text-zinc-500 text-sm mt-1">Gestiona las solicitudes entrantes y libera espacio eliminando proyectos resueltos.</p>
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
                <p className="text-sm text-zinc-400 line-clamp-1 pt-1">{pedido.descripcion}</p>
              </div>

              <div className="flex md:flex-col lg:flex-row gap-3 h-fit w-full md:w-auto">
                <button
                  onClick={() => abrirPedido(pedido)}
                  style={{ touchAction: 'manipulation' }}
                  className="flex-1 md:flex-none text-center px-4 py-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-lg text-sm font-semibold text-zinc-200 transition-colors whitespace-nowrap"
                >
                  Ver Pedido
                </button>
              </div>
            </div>
          ))}

          {pedidos.length === 0 && (
            <p className="text-zinc-500 text-center py-16 border border-dashed border-zinc-900 rounded-xl">No hay registros de clientes aún.</p>
          )}
        </div>
      </div>

      {/* COMPONENTE SHEET LATERAL ANIMADO */}
      {pedidoSeleccionado && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={cerrarSheet}
            className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-out ${mostrarSheet ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
          />

          <div
            className={`relative w-full max-w-lg h-full bg-zinc-950 border-l border-zinc-900 p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 ease-out transform ${mostrarSheet ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-90'
              }`}
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
                <div>
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1">
                    Detalle de Solicitud
                  </span>
                  <h2 className="text-xl font-black tracking-tight text-zinc-100">
                    {pedidoSeleccionado.nombre}
                  </h2>
                </div>
                <button
                  onClick={cerrarSheet}
                  className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors font-medium text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Fecha de Ingreso</h4>
                  <p className="text-sm text-zinc-300 font-mono">
                    {new Date(pedidoSeleccionado.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Correo Electrónico</h4>
                  <p className="text-sm text-zinc-300 select-all font-medium text-amber-500/90">
                    {pedidoSeleccionado.correo}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">WhatsApp</h4>
                  <p className="text-sm text-zinc-300 font-mono">{pedidoSeleccionado.whatsapp}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Requerimientos del Cliente</h4>
                  <p className="text-sm text-zinc-400 bg-zinc-900/50 border border-zinc-900 p-4 rounded-xl leading-relaxed whitespace-pre-line max-h-[45vh] overflow-y-auto">
                    {pedidoSeleccionado.descripcion}
                  </p>
                </div>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN: SUSTITUIDO WHATSAPP POR ELIMINAR PEDIDO */}
            <div className="space-y-3 pt-6 border-t border-zinc-900">
              {pedidoSeleccionado.archivo_url && (
                <a
                  href={pedidoSeleccionado.archivo_url}
                  download
                  className="block w-full text-center px-4 py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 font-bold rounded-xl text-sm transition-colors"
                >
                  Descargar Archivo 3D
                </a>
              )}
              <button
                onClick={() => eliminarPedido(pedidoSeleccionado)}
                disabled={eliminandoId !== null}
                style={{ touchAction: 'manipulation' }}
                className="block w-full text-center px-4 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm transition-colors disabled:bg-zinc-800 disabled:text-zinc-600"
              >
                {eliminandoId ? "Eliminando..." : "Eliminar Pedido"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
