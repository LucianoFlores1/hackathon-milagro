"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Post = {
    id: string
    title: string
    description: string
    status: string
    species: string
    zone_text: string
    event_date: string
    contact_type: string
    contact_value: string
    created_at: string
}

export default function Home() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [status, setStatus] = useState("lost")
    const [species, setSpecies] = useState("dog")
    const [zoneText, setZoneText] = useState("")
    const [eventDate, setEventDate] = useState("")
    const [contactType, setContactType] = useState("whatsapp")
    const [contactValue, setContactValue] = useState("")
    const [posts, setPosts] = useState<Post[]>([])

    useEffect(() => {
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .order("created_at", { ascending: false })
            if (!error && data) setPosts(data as Post[])
        }
        fetchPosts()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const { error } = await supabase.from("posts").insert({
            title,
            description,
            status,
            species,
            zone_text: zoneText, // Agregado
            event_date: eventDate, // Agregado
            contact_type: contactType, // Agregado
            contact_value: contactValue // Agregado
        })
        if (!error) {
            setTitle("")
            setDescription("")
            setStatus("lost")
            setSpecies("dog")
            setZoneText("") // Agregado
            setEventDate("") // Agregado
            setContactType("whatsapp") // Agregado
            setContactValue("") // Agregado
            const { data } = await supabase.from("posts").select("*").order("id", { ascending: false })
            if (data) setPosts(data as Post[])
        }
    }

    return (
        <div className="p-6 space-y-6">
            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                        id="title"
                        placeholder="Título"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                        id="description"
                        placeholder="Descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Selecciona el estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="lost">Perdido</SelectItem>
                            <SelectItem value="found">Encontrado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="species">Especie</Label>
                    <Select value={species} onValueChange={setSpecies}>
                        <SelectTrigger id="species">
                            <SelectValue placeholder="Selecciona la especie" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="dog">Perro</SelectItem>
                            <SelectItem value="cat">Gato</SelectItem>
                            <SelectItem value="other">Otro</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="zone">Zona aproximada</Label>
                    <Input id="zone" placeholder="Ej: Cerrillos" value={zoneText} onChange={(e) => setZoneText(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="event-date">Fecha del hecho</Label>
                    <Input id="event-date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contact-type">Tipo de contacto</Label>
                    <Select value={contactType} onValueChange={setContactType}>
                        <SelectTrigger id="contact-type">
                            <SelectValue placeholder="Selecciona el tipo de contacto" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="form">Formulario</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contact-value">Valor de contacto</Label>
                    <Input id="contact-value" placeholder="Ej: 3811234567 o email@ejemplo.com" value={contactValue} onChange={(e) => setContactValue(e.target.value)} />
                </div>
                <Button type="submit">Crear post</Button>
            </form>

            {/* Lista de posts con tarjeta esta vez*/}
            <div className="space-y-4 mt-8">
                {posts.map((post) => (
                    <Card key={post.id} className="shadow-md">
                        <CardHeader>
                            <CardTitle>{post.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p>{post.description}</p>
                            <p className="text-sm text-gray-600">Estado: {post.status}</p>
                            <p className="text-sm text-gray-600">Especie: {post.species}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}