'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        // Fondo translúcido con efecto blur (backdrop-blur) para integrarse con el fondo negro
        <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-zinc-900">
            <div className="max-w-5xl mx-auto px-6">
                <div className="flex justify-between items-center h-20">

                    {/* Logo Minimalista: Sin la caja gris genérica, tipografía pura */}
                    <Link href="/" className="flex items-center tracking-tight group">
                        <span className="text-zinc-50 font-black text-xl transition-colors group-hover:text-amber-500">
                            3D<span className="text-amber-500 group-hover:text-zinc-50 transition-colors ml-1">Sing</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation: Fuentes limpias y hover sutil al color ámbar */}
                    <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide uppercase">
                        <Link
                            href="/"
                            className="text-zinc-400 hover:text-zinc-50 transition-colors duration-200"
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/galeria"
                            className="text-zinc-400 hover:text-zinc-50 transition-colors duration-200"
                        >
                            Galería
                        </Link>
                        <Link
                            href="/FAQs"
                            className="block px-3 py-2 rounded-xl text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900 transition-colors"
                        >
                            FAQs
                        </Link>
                        <a
                            href="/pedido"
                            className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-50 hover:bg-zinc-800/50 rounded-lg transition-all duration-200 lowercase first-letter:uppercase"
                        >
                            Enviar Pedido
                        </a>

                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 focus:outline-none"
                        aria-label="Menu"
                    >
                        <svg
                            className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 8h16M4 16h16'}
                            />
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <nav className="md:hidden pb-6 pt-2 space-y-3 border-t border-zinc-900/50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Link
                            href="/"
                            className="block px-3 py-2 rounded-xl text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/galeria"
                            className="block px-3 py-2 rounded-xl text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Galería
                        </Link>
                        <Link
                            href="/FAQQs"
                            className="block px-3 py-2 rounded-xl text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            FAQs
                        </Link>
                        <a
                            href="whatsapp://send?phone=+59891332228"
                            className="block px-3 py-2 rounded-xl text-center bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-50 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Enviar pedido
                        </a>
                    </nav>
                )}
            </div>
        </header>
    );
}
