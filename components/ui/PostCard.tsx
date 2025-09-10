import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dog, Cat, PawPrint, MapPin, Calendar, MessageCircle, Mail } from "lucide-react";
import Link from "next/link";

export type Post = {
    id: string;
    title: string;
    description: string;
    status: string;
    species: string;
    zone_text: string;
    event_date: string;
    contact_type: string;
    contact_value: string;
    created_at: string;
    image_url: string | null;
    resolved?: boolean;
};

export function formatRelativeDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30.44);
    if (minutes < 1) return "hace unos segundos";
    if (minutes < 60) return `hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
    if (hours < 24) return `hace ${hours} hora${hours > 1 ? "s" : ""}`;
    if (days < 30) return `hace ${days} día${days > 1 ? "s" : ""}`;
    if (months < 12) return `hace ${months} mes${months > 1 ? "es" : ""}`;
    return date.toLocaleDateString();
}


interface PostCardProps {
    post: Post;
    href?: string;
}

// Ejemplo de función para marcar como resuelto usando fetch y header x-edit-token
export async function markAsResolved(postId: string) {
    const token = localStorage.getItem(`edit_token_${postId}`);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/posts?id=eq.${postId}`, {
            method: "PATCH",
            headers: {
                "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
                "Content-Type": "application/json",
                "x-edit-token": token || "",
            },
            body: JSON.stringify({ resolved: true, contact_value: "" }),
        });
        if (response.status === 204) return {};
        const result = await response.json();
        if (!response.ok) {
            console.error("Error al marcar como resuelto:", result);
            throw new Error(result?.message || "Error desconocido");
        }
        return result;
    } catch (e) {
        console.error("Excepción en markAsResolved:", e);
        throw e;
    }
}

const PostCard = ({ post, href }: PostCardProps) => {
    const cardContent = (
        <Card className="transform transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl animate-fadeIn relative overflow-hidden">
            {/* Cinta verde si está resuelto */}
            {post.resolved && (
                <div className="absolute top-8 left-[-60px] rotate-[-20deg] w-[300px] bg-green-600 text-white text-center py-2 font-bold shadow-lg z-20">
                    Esta mascota encontró a su familia
                </div>
            )}
            <div>
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
                <CardContent className="space-y-2">
                    {post.image_url && (
                        <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-48 object-cover rounded-md"
                        />
                    )}
                    <p className="text-sm text-gray-700 line-clamp-1">{post.description}</p>
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
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatRelativeDate(post.event_date)}
                        </Badge>
                    </div>
                </CardContent>
            </div>
            {/* Contacto solo si no está resuelto */}
            {(!post.resolved && (post.contact_type || post.contact_value)) && (
                <CardContent>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                        {post.contact_type === "whatsapp" ? <MessageCircle size={16} /> : <Mail size={16} />}
                        <span>
                            Contacto:
                            {post.contact_type === "whatsapp" ? (
                                <span
                                    className="ml-1 text-blue-500 underline cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(`https://wa.me/${post.contact_value}`, "_blank");
                                    }}
                                >
                                    {post.contact_value}
                                </span>
                            ) : (
                                <span
                                    className="ml-1 text-blue-500 underline cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(`mailto:${post.contact_value}`);
                                    }}
                                >
                                    {post.contact_value}
                                </span>
                            )}
                        </span>
                    </div>
                </CardContent>
            )}
        </Card>
    );

    return href ? <Link href={href}>{cardContent}</Link> : cardContent;
};

export default PostCard;
