"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdoptionCard from "@/components/ui/AdoptionCard";
import AdoptionForm from "@/components/ui/AdoptionForm";
import { Adoption } from "@/types/adoption";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AdopcionesPage() {
    const [adoptions, setAdoptions] = useState<Adoption[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>("all"); // available | adopted | all
    const [filterSpecies, setFilterSpecies] = useState<string>("all"); // dog | cat | other | all
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        fetchAdoptions();
    }, [filterStatus, filterSpecies, searchTerm]);

    const fetchAdoptions = async () => {
        setLoading(true);
        let query = supabase.from("adoptions").select("*");

        if (filterStatus && filterStatus !== "all") {
            query = query.eq("status", filterStatus);
        }

        if (filterSpecies && filterSpecies !== "all") {
            query = query.eq("species", filterSpecies);
        }

        if (searchTerm) {
            // búsqueda en nombre o descripción
            query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
        }

        const { data, error } = await query.order("created_at", { ascending: false });

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

            {/* Tarjeta de búsqueda y filtros (coherente con Home) */}
            <Card className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-200">
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end gap-6">
                        <div className="space-y-2 flex-grow">
                            <Label htmlFor="search" className="font-semibold text-blue-700 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" /></svg>
                                Buscar por nombre o descripción
                            </Label>
                            <Input
                                className="rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200 bg-white shadow-sm px-4 py-2"
                                id="search"
                                placeholder="Ej: Cachorro en Barrio Centro..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-4 w-full">
                            {/* Filtro por estado */}
                            <div className="space-y-2 w-full md:w-44">
                                <Label htmlFor="filter-status" className="font-semibold text-blue-700 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Estado
                                </Label>
                                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
                                    <SelectTrigger id="filter-status" className="rounded-xl border-blue-300 focus:border-blue-500 bg-white shadow-sm px-4 py-2">
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="available">Disponible</SelectItem>
                                        <SelectItem value="adopted">Adoptado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Filtro por especie */}
                            <div className="space-y-2 w-full md:w-44">
                                <Label htmlFor="filter-species" className="font-semibold text-blue-700 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                                    Especie
                                </Label>
                                <Select value={filterSpecies} onValueChange={(value) => setFilterSpecies(value)}>
                                    <SelectTrigger id="filter-species" className="rounded-xl border-blue-300 focus:border-blue-500 bg-white shadow-sm px-4 py-2">
                                        <SelectValue placeholder="Todas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas</SelectItem>
                                        <SelectItem value="dog">Perro</SelectItem>
                                        <SelectItem value="cat">Gato</SelectItem>
                                        <SelectItem value="other">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button
                            onClick={() => {
                                setFilterStatus("all");
                                setFilterSpecies("all");
                                setSearchTerm("");
                            }}
                            className="w-full md:w-auto mt-2 md:mt-0 rounded-xl px-4 py-2 shadow-md bg-blue-500 text-white font-semibold hover:bg-blue-600 hover:scale-105 transition-all duration-300"
                            variant={"default"}
                        >
                            Limpiar filtros
                        </Button>
                    </div>
                </div>
            </Card>

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