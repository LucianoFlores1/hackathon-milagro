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

const PostCard = ({ post, href }: PostCardProps) => {
    const cardContent = (
        <Card className="transform transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl animate-fadeIn">
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
                    <p className="text-sm text-gray-800">{post.description}</p>
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
            {(post.contact_type || post.contact_value) && (
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
