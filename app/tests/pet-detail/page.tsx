"use client";

import PetDetailCard from "@/components/ui/PetDetailCard";

const mockPet = {
    id: "1",
    title: "Perro en adopción",
    description: "Cachorro mestizo, muy juguetón y cariñoso. Busca familia responsable.",
    status: "adoption",
    species: "dog",
    zone_text: "Barrio Centro",
    event_date: "2025-09-17",
    contact_type: "whatsapp",
    contact_value: "3815551234",
    image_url: "https://placedog.net/500",
    resolved: false,
    reports_count: 0,
    contact_hidden: false,
};

export default function PetDetailCardTest() {
    return (
        <div className="max-w-xl mx-auto mt-10">
            <PetDetailCard
                pet={mockPet}
                type="adopcion"
                onContact={() => alert("Contacto!")}
                onShare={() => alert("Compartir!")}
                onReport={() => alert("Reportado!")}
                canMarkResolved={true}
                onMarkResolved={() => alert("Marcado como resuelto!")}
            />
        </div>
    );
}