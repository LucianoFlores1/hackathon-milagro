"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validaciones obligatorias
        const errors: { [key: string]: string } = {};
        if (!title.trim()) errors.title = "El título es obligatorio.";
        if (!description.trim()) errors.description = "La descripción es obligatoria.";
        if (!contactValue.trim()) errors.contactValue = "El contacto es obligatorio.";
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) {
            setError("Por favor corrige los errores marcados.");
            return;
        }

        setLoading(true);

        // Subir imagen si hay archivo seleccionado
        let finalImageUrl = imageUrl;
        if (imageFile) {
            setUploading(true);
            const fileName = `${Date.now()}-${imageFile.name}`;
            const filePath = `images/${fileName}`;
            const { error: uploadError } = await supabase.storage
                .from("post-images")
                .upload(filePath, imageFile, {
                    cacheControl: "3600",
                    upsert: false,
                });
            if (uploadError) {
                setError("Error al subir la imagen. Intenta de nuevo.");
                setUploading(false);
                setLoading(false);
                return;
            }
            const { data } = supabase.storage
                .from("post-images")
                .getPublicUrl(filePath);
            if (data?.publicUrl) {
                finalImageUrl = data.publicUrl;
            }
            setUploading(false);
        }

        // Generar token único de edición
        const edit_token = (typeof crypto !== "undefined" && 'randomUUID' in crypto)
            ? (crypto as any).randomUUID()
            : Math.random().toString(36).slice(2);

        const { data: insertData, error: insertError } = await supabase
            .from("adoptions")
            .insert([
                {
                    species,
                    name: title,
                    description,
                    status: "available",
                    zone_text: zone,
                    contact_type: contactType,
                    contact_value: contactValue,
                    image_url: finalImageUrl,
                    edit_token,
                },
            ])
            .select();

        setLoading(false);

        if (insertError) {
            setError("Error al publicar la adopción.");
        } else {
            // Guardar token en localStorage para futuras ediciones
            const newId = insertData?.[0]?.id as string | undefined;
            if (newId && typeof window !== 'undefined') {
                localStorage.setItem(`adoption_edit_token_${newId}`, edit_token);
            }
            setSuccess(true);
            setTitle("");
            setDescription("");
            setZone("");
            setContactType("whatsapp");
            setContactValue("");
            setImageUrl("");
            setImageFile(null);
            setImagePreview(null);
            setFieldErrors({});
            if (onSuccess) onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-100 space-y-4 w-full p-6 rounded-xl">

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
                <Label>Título <span className="text-red-500">*</span></Label>
                <Input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Ej: Perrito busca hogar"
                    className={fieldErrors.title ? "border-red-500 focus:border-red-500" : ""}
                    aria-invalid={!!fieldErrors.title}
                    aria-describedby={fieldErrors.title ? "error-title" : undefined}
                />
                {fieldErrors.title && (
                    <span id="error-title" className="text-xs text-red-600" role="alert">{fieldErrors.title}</span>
                )}
            </div>

            <div>
                <Label>Descripción <span className="text-red-500">*</span></Label>
                <Textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className={fieldErrors.description ? "border-red-500 focus:border-red-500" : ""}
                    aria-invalid={!!fieldErrors.description}
                    aria-describedby={fieldErrors.description ? "error-description" : undefined}
                />
                {fieldErrors.description && (
                    <span id="error-description" className="text-xs text-red-600" role="alert">{fieldErrors.description}</span>
                )}
            </div>

            <div>
                <Label>Zona</Label>
                <Input value={zone} onChange={e => setZone(e.target.value)} placeholder="Ej: Barrio Centro" />
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
                <Label>Contacto <span className="text-red-500">*</span></Label>
                <Input
                    value={contactValue}
                    onChange={e => setContactValue(e.target.value)}
                    placeholder="Ej: 3815551234 o mail@ejemplo.com"
                    className={fieldErrors.contactValue ? "border-red-500 focus:border-red-500" : ""}
                    aria-invalid={!!fieldErrors.contactValue}
                    aria-describedby={fieldErrors.contactValue ? "error-contact-value" : undefined}
                />
                {fieldErrors.contactValue && (
                    <span id="error-contact-value" className="text-xs text-red-600" role="alert">{fieldErrors.contactValue}</span>
                )}
            </div>

            <div>
                <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Pega el link de la imagen o súbela" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">Foto</Label>
                <Input
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            setImageFile(file);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setImagePreview(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                        } else {
                            setImagePreview(null);
                            setImageFile(null);
                        }
                    }}
                    disabled={uploading}
                />
                {imagePreview && (
                    <div className="mt-2">
                        <img src={imagePreview} alt="Vista previa" className="w-full max-h-48 object-contain rounded-lg border" />
                        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => { setImagePreview(null); setImageFile(null); }}>
                            Quitar imagen
                        </Button>
                    </div>
                )}
            </div>

            {error && <div className="text-red-600">{error}</div>}
            {success && <div className="text-green-600">¡Publicación exitosa!</div>}

            <Button type="submit" disabled={loading || uploading}>
                {loading || uploading ? "Publicando..." : "Publicar"}
            </Button>
        </form>
    );
}