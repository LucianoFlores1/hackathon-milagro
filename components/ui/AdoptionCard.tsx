import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dog, Cat, PawPrint, MapPin, Calendar, MessageCircle, Mail } from "lucide-react";
import Link from "next/link";
import { Adoption } from "@/types/adoption";

interface AdoptionCardProps {
    adoption: Adoption;
    href?: string;
}

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

const AdoptionCard = ({ adoption, href }: AdoptionCardProps) => {
    const cardContent = (
        <Card className="transform transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl animate-fadeIn relative overflow-hidden">
            {/* Cinta si está adoptado */}
            {adoption.status === "adopted" && (
                <div className="absolute top-8 left-[-60px] rotate-[-20deg] w-[300px] bg-green-600 text-white text-center py-2 font-bold shadow-lg z-20">
                    ¡Este perrito fue adoptado!
                </div>
            )}
            <div>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        {adoption.name}
                        <Badge
                            variant="outline"
                            className="bg-blue-600 text-white"
                        >
                            Adopción
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {adoption.image_url && (
                        <img
                            src={adoption.image_url}
                            alt={adoption.name}
                            className="w-full h-48 object-cover rounded-md"
                        />
                    )}
                    <p className="text-sm text-gray-700 line-clamp-1">{adoption.description}</p>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                        <Badge variant="secondary" className="flex items-center gap-1">
                            {adoption.species === "dog" ? <Dog size={14} /> : adoption.species === "cat" ? <Cat size={14} /> : <PawPrint size={14} />}
                            {adoption.species}
                        </Badge>
                        {adoption.zone_text && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <MapPin size={14} />
                                {adoption.zone_text}
                            </Badge>
                        )}
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatRelativeDate(adoption.created_at)}
                        </Badge>
                    </div>
                </CardContent>
            </div>
            {/* Contacto solo si está disponible */}
            {adoption.status !== "adopted" && (adoption.contact_type || adoption.contact_value) && (
                <CardContent>
                    {/* Cartel de revisión por reportes */}
                    {adoption.contact_hidden && (
                        <div className="absolute inset-0 flex items-center justify-center bg-yellow-200/90 z-30">
                            <span className="text-yellow-800 font-bold text-xl text-center px-4">
                                🕵️‍♂️<br />Este post está en revisión por reportes de la comunidad
                            </span>
                        </div>
                    )}
                    <div className="flex items-center gap-1 mt-2">
                        {adoption.contact_type === "whatsapp" ? <MessageCircle size={16} /> : <Mail size={16} />}
                        <span>
                            Contacto:
                            {adoption.contact_type === "whatsapp" ? (
                                <span
                                    className="ml-1 text-blue-500 underline cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(`https://wa.me/${adoption.contact_value}`, "_blank");
                                    }}
                                >
                                    {adoption.contact_value}
                                </span>
                            ) : (
                                <span
                                    className="ml-1 text-blue-500 underline cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(`mailto:${adoption.contact_value}`);
                                    }}
                                >
                                    {adoption.contact_value}
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

export default AdoptionCard;