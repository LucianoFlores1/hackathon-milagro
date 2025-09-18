"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase"

export default function AdoptionForm({ onSuccess }: { onSuccess?: () => void }) {
    const [species, setSpecies] = useState("dog");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [zone, setZone] = useState("");
    const [contactType, setContactType] = useState("whatsapp");
    const [contactValue, setContactValue] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Generar edit_token simple (puedes mejorar esto)
        const edit_token = Math.random().toString(36).slice(2);


        const { error } = await supabase.from("adoptions").insert([
            {
                species,
                name: title,
                description,
                zone_text: zone,
                contact_type: contactType,
                contact_value: contactValue,
                image_url: imageUrl,
                edit_token,
            },
        ]);

        setLoading(false);

        if (error) {
            setError("Error al publicar la adopción.");
        } else {
            setSuccess(true);
            if (onSuccess) onSuccess();
            // Puedes guardar el edit_token en localStorage o mostrarlo al usuario
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-2">Publicar perrito en adopción</h2>

            <div>
                <Label>Especie</Label>
                <Select value={species} onValueChange={setSpecies}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona especie" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="dog">Perro</SelectItem>
                        <SelectItem value="cat">Gato</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Título</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Perrito busca hogar" required />
            </div>

            <div>
                <Label>Descripción</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} required />
            </div>

            <div>
                <Label>Zona</Label>
                <Input value={zone} onChange={e => setZone(e.target.value)} placeholder="Ej: Barrio Centro" required />
            </div>

            <div>
                <Label>Tipo de contacto</Label>
                <Select value={contactType} onValueChange={setContactType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo de contacto" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Contacto</Label>
                <Input value={contactValue} onChange={e => setContactValue(e.target.value)} placeholder="Ej: 3815551234 o mail@ejemplo.com" required />
            </div>

            <div>
                <Label>Imagen (URL)</Label>
                <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Pega el link de la imagen o súbela" />
                {/* Aquí puedes agregar lógica para subir la imagen a Supabase Storage si lo deseas */}
            </div>

            {error && <div className="text-red-600">{error}</div>}
            {success && <div className="text-green-600">¡Publicación exitosa!</div>}

            <Button type="submit" disabled={loading}>
                {loading ? "Publicando..." : "Publicar"}
            </Button>
        </form>
    );
}