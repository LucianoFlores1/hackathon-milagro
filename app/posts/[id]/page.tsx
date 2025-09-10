"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
// import { markAsResolved } from "@/components/ui/PostCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dog, Cat, PawPrint, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MessageCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Spinner } from "@/components/ui/Spinner";
import { PostSkeleton } from "@/components/ui/PostSkeleton"

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
    resolved?: boolean
    edit_token?: string
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
    const [navigating, setNavigating] = useState(false);
    const [markingResolved, setMarkingResolved] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const router = useRouter();
    useEffect(() => {
        const fetchPost = async () => {
            const { data } = await supabase.from("posts").select("*").eq("id", params.id).single();
            setPost(data as Post);
        };
        fetchPost();
    }, [params.id]);

    // Verifica si el usuario tiene el token correcto en localStorage
    const canMarkResolved = post && post.edit_token && localStorage.getItem(`edit_token_${post.id}`) === post.edit_token && !post.resolved;

    const handleMarkResolved = async () => {
        if (!post) return;
        setMarkingResolved(true);
        const token = localStorage.getItem(`edit_token_${post.id}`);
        const { error } = await supabase
            .from("posts")
            .update({ resolved: true, contact_value: "" })
            .eq("id", post.id)
            .eq("edit_token", token);
        if (error) {
            setSuccessMsg("No se pudo marcar como resuelto. Verifica el token o la conexión.");
            console.error("Error al marcar como resuelto:", error);
        } else {
            setSuccessMsg("¡El post fue marcado como resuelto!");
            // Refresca el post desde la base de datos para asegurar el estado visual
            const { data, error: fetchError } = await supabase.from("posts").select("*").eq("id", post.id).single();
            if (fetchError) {
                setSuccessMsg("Marcado, pero no se pudo refrescar el post.");
                console.error("Error refrescando post:", fetchError);
            } else {
                setPost(data as Post);
            }
        }
        setMarkingResolved(false);
    };

    if (!post) return (
        <div className="p-6 space-y-6 max-w-2xl mx-auto relative">
            {successMsg && (
                <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-700 text-center font-semibold">
                    {successMsg}
                </div>
            )}
            <div className="flex items-center justify-center min-h-[300px]">
                <PostSkeleton />
            </div>
        </div>
    );

    return (
        <div className="p-6 space-y-6 max-w-2xl mx-auto relative">
            {navigating && (
                <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
                    <div className="flex flex-col items-center">
                        <Spinner />
                    </div>
                </div>
            )}
            <Link href="/">
                <Button variant="outline" className="mb-4" onClick={() => {
                    setNavigating(true);
                    router.back();
                }}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                </Button>
            </Link>

            <Card className="relative overflow-hidden">
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
                {/* Cinta visual si está resuelto */}
                {post.resolved && (
                    <div className="absolute top-8 left-[-60px] rotate-[-20deg] w-[300px] bg-green-600 text-white text-center py-2 font-bold shadow-lg z-20">
                        Este amigo fiel encontró a su familia
                    </div>
                )}
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
                    {post.contact_type && post.contact_value && !post.resolved && (
                        <div className="pt-4">
                            <ContactButton type={post.contact_type} value={post.contact_value} />
                        </div>
                    )}
                    {/* Si está resuelto, contacto bloqueado visualmente */}
                    {post.resolved && (
                        <div className="pt-4">
                            <div className="bg-gray-200 text-gray-500 rounded-lg p-4 text-center font-semibold">
                                El contacto fue bloqueado porque la mascota ya fue encontrada.
                            </div>
                        </div>
                    )}
                    {/* Botón marcar como resuelto */}
                    {canMarkResolved && (
                        <div className="pt-4">
                            <Button
                                onClick={handleMarkResolved}
                                disabled={markingResolved}
                                className="bg-green-600 text-white hover:bg-green-700 rounded-xl px-4 py-2 shadow-md"
                            >
                                {markingResolved ? "Marcando..." : "Marcar como resuelto"}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}