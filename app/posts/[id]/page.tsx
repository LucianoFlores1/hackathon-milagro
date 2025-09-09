"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dog, Cat, PawPrint, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MessageCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

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
    image_url: string | null
}

function ContactButton({ type, value }: { type: string; value: string }) {
    if (!value) return null

    if (type === "whatsapp") {
        return (
            <Button asChild className="w-full">
                <a href={`https://wa.me/${value}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" /> Contactar por WhatsApp
                </a>
            </Button>
        )
    }

    if (type === "phone") {
        return (
            <Button asChild className="w-full">
                <a href={`tel:${value}`}>
                    <Phone className="mr-2 h-4 w-4" /> Llamar ahora
                </a>
            </Button>
        )
    }

    if (type === "email") {
        return (
            <Button asChild className="w-full">
                <a href={`mailto:${value}`}>
                    <Mail className="mr-2 h-4 w-4" /> Enviar correo
                </a>
            </Button>
        )
    }

    return null
}

export default function PostDetail() {
    const params = useParams()
    const [post, setPost] = useState<Post | null>(null)

    useEffect(() => {
        const fetchPost = async () => {
            const { data } = await supabase.from("posts").select("*").eq("id", params.id).single()
            setPost(data as Post)
        }
        fetchPost()
    }, [params.id])

    if (!post) return <p className="text-center mt-10">Cargando...</p>

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <Link href="/">
                <Button variant="outline" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                </Button>
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        {post.title}
                        <Badge
                            variant="outline"
                            className={`${post.status === "lost" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
                        >
                            {post.status === "lost" ? "Perdido" : "Encontrado"}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {post.image_url && (
                        <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full max-h-[500px] object-contain rounded-md"
                        />
                    )}

                    <p className="text-gray-800">{post.description}</p>

                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                        <Badge variant="secondary" className="flex items-center gap-1">
                            {post.species === "dog" ? <Dog size={14} /> : post.species === "cat" ? <Cat size={14} /> : <PawPrint size={14} />}
                            {post.species}
                        </Badge>
                        {post.zone_text && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <MapPin size={14} />
                                {post.zone_text}
                            </Badge>
                        )}
                        {post.event_date && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(post.event_date).toLocaleDateString()}
                            </Badge>
                        )}
                    </div>

                    {/* 🔹 Botón de contacto destacado */}
                    {post.contact_type && post.contact_value && (
                        <div className="pt-4">
                            <ContactButton type={post.contact_type} value={post.contact_value} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}