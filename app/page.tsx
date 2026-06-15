
"use client";

import { useEffect, useState, useRef } from "react";

interface model{
  id: number,
  nombre:string,
  archivo:string,
  descripcion:string
}

const MODELOS_CATALOGO:model[] = [
  {
    id: 1,
    nombre: "Figura Artística de Colección",
    archivo: "/modelos/muñeco.glb",
    descripcion: "Impresión premium en resina de alta definición. Ideal para fanáticos y coleccionistas que buscan un nivel de detalle milimétrico y superficies ultra lisas listas para pintar."
  },
  {
    id: 2,
    nombre: "Dragón Articulado Fantasía",
    archivo: "/modelos/dragon.glb",
    descripcion: "Impreso en plástico técnico PETG de alta resistencia. Cuenta con un diseño flexible y articulaciones móviles mecánicas que demuestran la precisión de nuestras tolerancias."
  },
  {
    id: 3,
    nombre: "Diorama Escénico 'La Cueva'",
    archivo: "/modelos/cueva.glb",
    descripcion: "Estructura decorativa orgánica impresa en PLA biodegradable. Una pieza de diseño geométrico complejo con texturas realistas, perfecta para ambientación en interiores."
  }
];

export default function Home() {
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);

  // Estado para saber qué modelo está viendo el usuario actualmente
  const [indiceActual, setIndiceActual] = useState(0);
  const modeloActual = MODELOS_CATALOGO[indiceActual];

  const modelRef = useRef<HTMLElement | null>(null);

  // Cargar el script de model-viewer del lado del cliente
  useEffect(() => {
    import("@google/model-viewer")
      .then(() => setModelViewerLoaded(true))
      .catch((err) => console.error("Error al cargar model-viewer:", err));
  }, []);

  // Escuchar el evento de carga nativo
  useEffect(() => {
    const viewer = modelRef.current;
    if (!viewer) return;

    const handleLoad = () => setIsModelReady(true);

    viewer.addEventListener("load", handleLoad);
    return () => viewer.removeEventListener("load", handleLoad);
  }, [modelViewerLoaded, indiceActual]); // Se ejecuta también al cambiar de modelo

  // Funciones para navegar por el carrusel
  const siguienteModelo = () => {
    setIsModelReady(false); // Volvemos a activar el estado de carga
    setIndiceActual((prev) => (prev + 1) % MODELOS_CATALOGO.length);
  };

  const anteriorModelo = () => {
    setIsModelReady(false);
    setIndiceActual((prev) => (prev - 1 + MODELOS_CATALOGO.length) % MODELOS_CATALOGO.length);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      {/* Hero Section: Impacto visual inmediato */}
      <main className="flex flex-col flex-1 items-center justify-center px-6 py-20 max-w-5xl mx-auto md:flex-row md:gap-12 w-full">

        {/* Textos que cambian dinámicamente según el modelo seleccionado */}
        <div className="flex flex-col space-y-6 text-center md:text-left md:w-1/2">
          <span className="text-sm font-semibold tracking-wider uppercase text-amber-500">
            Modelos 3D Interactivos
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Hacemos realidad tus ideas en plástico y resina.
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <a
              href="#cotizar"
              className="px-6 py-3 text-center font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-lg transition-colors"
            >
              Cotizar Pieza
            </a>
          </div>
        </div>

        {/* CONTENEDOR DEL CARRUSEL 3D */}
        <div className="mt-10 md:w-1/2 flex flex-col items-center gap-6 w-full">
          <h2 className="text-center text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 min-h-[32px]">
            {modeloActual.nombre}
          </h2>

          <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-2xl bg-zinc-200 dark:bg-zinc-900 overflow-hidden shadow-xl border border-zinc-200 dark:border-zinc-800">
            {/* Pantalla de carga */}
            {!isModelReady && (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm bg-zinc-200 dark:bg-zinc-900 pointer-events-none z-10">
                Cargando {modeloActual.nombre}...
              </div>
            )}

            {/* Visor Único Reactivo */}
            {modelViewerLoaded && (
              /* @ts-ignore */
              <model-viewer
                ref={modelRef}
                src={modeloActual.archivo} // Cambia dinámicamente de archivo .glb
                alt={modeloActual.nombre}
                auto-rotate
                camera-controls
                touch-action="none"
                shadow-intensity="4"
                style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
              /* @ts-ignore */
              ></model-viewer>
            )}
          </div>

          <p className="text-sm sm:text-base text-center text-zinc-600 dark:text-zinc-400 max-w-sm sm:max-w-md px-2 min-h-[80px] leading-relaxed">
            {modeloActual.descripcion}
          </p>

          {/* Flechas de Navegación del Carrusel con touch-action: manipulation */}
          <div className="flex items-center gap-6 pt-2">
            <button
              onClick={anteriorModelo}
              style={{ touchAction: "manipulation" }}
              className="p-3 rounded-full border border-zinc-300 hover:bg-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Modelo anterior"
            >
              ←
            </button>
            <span className="text-sm font-medium text-zinc-500">
              {indiceActual + 1} / {MODELOS_CATALOGO.length}
            </span>
            <button
              onClick={siguienteModelo}
              style={{ touchAction: "manipulation" }}
              className="p-3 rounded-full border border-zinc-300 hover:bg-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Siguiente modelo"
            >
              →
            </button>
          </div>
        </div>

      </main>

      {/* Características / Propuesta de Valor */}
      <section className="bg-zinc-100 dark:bg-zinc-900/50 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-lg font-bold mb-2">Materiales Premium</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              Trabajamos con PLA, PETG, ABS y Resina de alta definición para máxima durabilidad.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-lg font-bold mb-2">Diseño y Optimización</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              ¿No tienes el archivo 3D? Te ayudamos a modelar o adaptar tu idea desde cero.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-lg font-bold mb-2">Envíos Rápidos</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              Despachamos tus piezas envueltas con máxima protección para que lleguen intactas.
            </p>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="cotizar" className="max-w-5xl mx-auto py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold tracking-wider uppercase text-amber-500 block mb-3">
            Proceso Simple
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-800 dark:text-zinc-100">
            ¿Cómo pedir tu impresión?
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Transformamos tus archivos digitales en piezas físicas en tres simples pasos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Paso 1 */}
          <div className="p-6 bg-zinc-100/60 dark:bg-zinc-900/30 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/50 flex flex-col justify-between min-h-[180px]">
            <div>
              <span className="text-4xl font-black text-zinc-300 dark:text-zinc-800 block mb-3 select-none">
                01
              </span>
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-2">
                Envía tu archivo
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Formatos .STL, .OBJ o .STEP directamente por WhatsApp o correo electrónico.
              </p>
            </div>
          </div>

          {/* Paso 2 */}
          <div className="p-6 bg-zinc-100/60 dark:bg-zinc-900/30 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/50 flex flex-col justify-between min-h-[180px]">
            <div>
              <span className="text-4xl font-black text-zinc-300 dark:text-zinc-800 block mb-3 select-none">
                02
              </span>
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-2">
                Recibe tu cotización
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Evaluamos la geometría, el tiempo de impresión, el material óptimo y te enviamos un presupuesto detallado.
              </p>
            </div>
          </div>

          <div className="p-6 bg-zinc-100/60 dark:bg-zinc-900/30 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/50 flex flex-col justify-between min-h-[180px]">
            <div>
              <span className="text-4xl font-black text-zinc-300 dark:text-zinc-800 block mb-3 select-none">
                03
              </span>
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-2">
                Retira o Recibe
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">

                Imprimimos tu pieza y te avisamos cuando esté lista.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

