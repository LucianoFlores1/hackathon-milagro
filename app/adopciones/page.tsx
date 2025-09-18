"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdoptionCard from "@/components/ui/AdoptionCard";
import { Adoption } from "@/types/adoption"; // <--- Importa el tipo aquí

export default function AdopcionesPage() {
    const [adoptions, setAdoptions] = useState<Adoption[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdoptions = async () => {
            const { data, error } = await supabase
                .from("adoptions")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error && data) setAdoptions(data as Adoption[]);
            setLoading(false);
        };

        fetchAdoptions();
    }, []);

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">🐾 Perritos en Adopción</h1>
            {loading && <div>Cargando...</div>}
            {!loading && adoptions.length === 0 && (
                <div className="text-gray-500">No hay perritos en adopción por ahora.</div>
            )}
            <div className="grid gap-6 md:grid-cols-2">
                {adoptions.map((adoption) => (
                    <AdoptionCard
                        key={adoption.id}
                        adoption={adoption}
                    />
                ))}
            </div>
        </div>
    );
}