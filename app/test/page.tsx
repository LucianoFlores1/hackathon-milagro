"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

export default function Home() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await supabase.from("posts").insert({
            status: "lost",
            species: "dog",
            title,
            description,
            zone_text: "Zona de prueba",
            contact_type: "whatsapp",
            contact_value: "https://wa.me/549381000000"
        })
        setTitle("")
        setDescription("")
        alert("Post creado!")
    }

    return (
        <main className="flex min-h-screen items-center justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
                <input
                    type="text"
                    placeholder="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <textarea
                    placeholder="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <Button type="submit">Crear post</Button>
            </form>
        </main>
    )
}
