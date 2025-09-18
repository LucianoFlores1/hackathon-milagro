"use client";

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react";
import PetDetailCard from "@/components/ui/PetDetailCard";

export default function AdopcionesPage() {
    const [adoptions, setAdoptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdoptions = async () => {
            const { data, error } = await supabase
                .from("adoptions")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error && data) setAdoptions(data);
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
                {adoptions.map((pet) => (
                    <PetDetailCard
                        key={pet.id}
                        pet={{
                            ...pet,
                            title: pet.name || "Sin nombre",
                            // Puedes mapear otros campos si tu componente espera otros nombres
                        }}
                        type="adopcion"
                    />
                ))}
            </div>
        </div>
    );
}