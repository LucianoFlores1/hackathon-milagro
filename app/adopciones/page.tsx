"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdoptionCard from "@/components/ui/AdoptionCard";
import AdoptionForm from "@/components/ui/AdoptionForm";
import { Adoption } from "@/types/adoption";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdopcionesPage() {
    const [adoptions, setAdoptions] = useState<Adoption[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchAdoptions();
    }, []);

    const fetchAdoptions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("adoptions")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) setAdoptions(data as Adoption[]);
        setLoading(false);
    };

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            {/* Nav coherente con Home */}
            <header className="sticky top-0 z-50 bg-white shadow-md">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-blue-600">🐾 Mi Amigo Fiel</h1>
                    <nav className="space-x-4">
                        <Link href="/" className="text-gray-700 hover:text-blue-600">
                            Inicio
                        </Link>
                        <button
                            onClick={() => {
                                setShowForm(true);
                                setTimeout(() => {
                                    const el = document.getElementById("create-adoption");
                                    if (el) el.scrollIntoView({ behavior: "smooth" });
                                }, 50);
                            }}
                            className="bg-blue-600 text-white w-full md:w-auto mt-2 md:mt-0 rounded-xl px-2 py-2 shadow-md 
                         hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                        >
                            Publicar adopción
                        </button>
                    </nav>
                </div>
            </header>

            {/* Disclaimer de seguridad (coherente) */}
            <div className="w-full max-w-4xl mx-auto mt-2 mb-4">
                <div className="flex items-center gap-2 bg-yellow-100 border border-yellow-300 text-yellow-900 rounded-lg px-4 py-2 text-sm font-medium shadow">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-700"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10A8 8 0 1 1 2 10a8 8 0 0 1 16 0zm-8.75-3a.75.75 0 0 1 1.5 0v3.25a.75.75 0 0 1-1.5 0V7zm.75 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Esta plataforma es colaborativa; se recomienda coordinar encuentros en
                    lugares públicos y seguros.
                </div>
            </div>

            {/* Toggle del formulario con animación igual a Home */}
            <Card
                className={`p-0 transition-max-height duration-500 overflow-hidden ${showForm ? "max-h-[1300px]" : "max-h-15"
                    } bg-blue-50 border border-blue-200 shadow-sm`}
            >
                <Button
                    variant="outline"
                    className="w-full rounded-xl px-4 py-2 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Ocultar formulario de adopción" : "➕ Publicar adopción"}
                </Button>

                {showForm && (
                    <div className="bg-gray-100 py-6 rounded-lg shadow-md space-y-4">
                        <h2 className="text-2xl font-semibold text-center">
                            Publicar un Aviso de Adopción
                        </h2>
                        <AdoptionForm
                            onSuccess={() => {
                                setShowForm(false);
                                fetchAdoptions();
                            }}
                        />
                    </div>
                )}
            </Card>


            <h1 className="text-3xl font-bold text-center">Adopciones</h1>

            {loading && <div>Cargando...</div>}
            {!loading && adoptions.length === 0 && (
                <div className="text-gray-500">No hay perritos en adopción por ahora.</div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-2">
                {adoptions.map((adoption) => (
                    <AdoptionCard key={adoption.id} adoption={adoption} />
                ))}
            </div>

            <footer className="mt-12 bg-gray-100 py-4 text-center text-sm text-gray-600">
                © 2025 Mascotas del Milagro – Mi Amigo Fiel 🐶🐱
            </footer>
        </div>
    );
}