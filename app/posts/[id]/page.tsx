"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dog, Cat, PawPrint, MapPin, Calendar, MessageCircle, Mail, ArrowLeft } from "lucide-react"
import { Ripples } from 'ldrs/react'
import 'ldrs/react/Ripples.css'

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
    image_url: string | null
}

const formatRelativeDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Simplificado para la vista de detalle
};

export default function PostDetail() {
    const { id } = useParams()
    const router = useRouter()
    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPost = async () => {
            if (!id || typeof id !== 'string') {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .eq("id", id)
                .single()

            if (!error && data) {
                setPost(data as Post)
            } else {
                setPost(null)
            }
            setLoading(false);
        }
        fetchPost()
    }, [id])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Ripples size="45" speed="2" color="black" />
                <p className="mt-4">Cargando post...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>No se encontró el post.</p>
            </div>
        );
    }

    const getSpeciesIcon = () => {
        switch (post.species) {
            case "dog": return <Dog className="w-4 h-4 mr-1" />
            case "cat": return <Cat className="w-4 h-4 mr-1" />
            default: return <PawPrint className="w-4 h-4 mr-1" />
        }
    }

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            {/* Botón para volver */}
            <Button
                variant="outline"
                onClick={() => {
                    setLoading(true);
                    router.push("/")
                }
                }
                className="flex items-center gap-2"
            >
                <ArrowLeft className="w-4 h-4" /> Volver
            </Button >
            <Card className="shadow-md">
                {post.image_url && (
                    <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full max-h-[500px] object-contain rounded-md"
                    />
                )}
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center justify-between">{post.title}</CardTitle>
                    <div className="flex gap-2 mt-2">
                        <Badge className={`${post.status === "lost" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
                            {post.status === "lost" ? "Perdido" : "Encontrado"}
                        </Badge>
                        <Badge variant="secondary" className="flex items-center">
                            {getSpeciesIcon()}{post.species}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>{post.description}</p>
                    <p className="flex items-center text-sm text-gray-600"><MapPin className="w-4 h-4 mr-1" /> **Zona:** {post.zone_text}</p>
                    <p className="flex items-center text-sm text-gray-600"><Calendar className="w-4 h-4 mr-1" /> **Fecha:** {formatRelativeDate(post.event_date)}</p>
                    {post.contact_type === "whatsapp" && (
                        <p className="flex items-center text-sm text-gray-600">
                            <MessageCircle className="w-4 h-4 mr-1" /> **WhatsApp:** <a href={`https://wa.me/${post.contact_value}`} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-500 underline">{post.contact_value}</a>
                        </p>
                    )}
                    {post.contact_type === "email" && (
                        <p className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-1" /> **Email:** <a href={`mailto:${post.contact_value}`} className="ml-1 text-blue-500 underline">{post.contact_value}</a>
                        </p>
                    )}
                </CardContent>
            </Card>
        </div >
    )
}