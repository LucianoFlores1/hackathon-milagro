import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dog, Cat, PawPrint, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShareButton from "@/components/ui/ShareButton";

type PetDetailCardProps = {
    pet: {
        id: string;
        title: string;
        description: string;
        status?: string; // "lost" | "found" | "adoption"
        species: string;
        zone_text: string;
        event_date: string;
        contact_type: string;
        contact_value: string;
        image_url: string | null;
        resolved?: boolean;
        reports_count?: number;
        contact_hidden?: boolean;
    };
    type: "perdido" | "encontrado" | "adopcion";
    onContact?: () => void;
    onShare?: () => void;
    onReport?: () => void;
    onMarkResolved?: () => void;
    canMarkResolved?: boolean;
    showCaptcha?: boolean;
    children?: React.ReactNode;
};

export default function PetDetailCard({
    pet,
    type,
    onContact,
    onShare,
    onReport,
    onMarkResolved,
    canMarkResolved,
    showCaptcha,
    children,
}: PetDetailCardProps) {
    return (
        <Card className="relative overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    {pet.title}
                    <Badge
                        variant="outline"
                        className={
                            type === "perdido"
                                ? "bg-red-500 text-white"
                                : type === "encontrado"
                                    ? "bg-green-500 text-white"
                                    : "bg-blue-500 text-white"
                        }
                    >
                        {type === "perdido"
                            ? "Perdido"
                            : type === "encontrado"
                                ? "Encontrado"
                                : "En adopción"}
                    </Badge>
                </CardTitle>
                <div className="mt-2">
                    <ShareButton postId={pet.id} postTitle={pet.title} />
                </div>
            </CardHeader>

            {/* Cinta visual si está resuelto */}
            {pet.resolved && (
                <div className="absolute top-8 left-[-60px] rotate-[-20deg] w-[300px] bg-green-600 text-white text-center py-2 font-bold shadow-lg z-20">
                    Este amigo fiel encontró a su familia
                </div>
            )}

            {/* Cartel de revisión */}
            {pet.contact_hidden && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center w-full h-full pointer-events-none">
                    <div className="bg-yellow-200 bg-opacity-80 rounded-lg px-8 py-6 text-center shadow-xl">
                        <span className="text-yellow-800 font-bold text-xl text-center px-4">
                            Esta publicación está en revisión por la comunidad.<br />
                            El contacto se ha ocultado temporalmente.
                        </span>
                    </div>
                </div>
            )}

            <CardContent
                className={`space-y-4 ${pet.contact_hidden
                    ? "blur-sm grayscale opacity-80 pointer-events-none"
                    : ""
                    }`}
            >
                {pet.image_url && (
                    <img
                        src={pet.image_url}
                        alt={pet.title}
                        className="w-full max-h-[500px] object-contain rounded-md"
                    />
                )}

                <p className="text-gray-800">{pet.description}</p>

                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    <Badge variant="secondary" className="flex items-center gap-1">
                        {pet.species === "dog" ? (
                            <Dog size={14} />
                        ) : pet.species === "cat" ? (
                            <Cat size={14} />
                        ) : (
                            <PawPrint size={14} />
                        )}
                        {pet.species}
                    </Badge>
                    {pet.zone_text && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <MapPin size={14} />
                            {pet.zone_text}
                        </Badge>
                    )}
                    {pet.event_date && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(pet.event_date).toLocaleDateString()}
                        </Badge>
                    )}
                </div>

                {/* Botón de contacto */}
                {pet.contact_type && pet.contact_value && !pet.resolved && !pet.contact_hidden && onContact && (
                    <div className="pt-4">
                        <Button onClick={onContact} className="w-full">
                            Contactar
                        </Button>
                    </div>
                )}

                {/* Si está resuelto, contacto bloqueado visualmente */}
                {pet.resolved && (
                    <div className="pt-4">
                        <div className="bg-gray-200 text-gray-500 rounded-lg p-4 text-center font-semibold">
                            El contacto fue bloqueado porque la mascota ya fue encontrada.
                        </div>
                    </div>
                )}

                {/* Botón Reportar */}
                {!pet.resolved && !pet.contact_hidden && onReport && (
                    <div className="pt-4">
                        <Button
                            variant="outline"
                            className="bg-red-100 text-red-700 hover:bg-red-200 rounded-xl px-4 py-2 shadow-md"
                            onClick={onReport}
                        >
                            Reportar
                        </Button>
                    </div>
                )}

                {/* Botón marcar como resuelto */}
                {canMarkResolved && onMarkResolved && (
                    <div className="pt-4">
                        <Button
                            onClick={onMarkResolved}
                            className="bg-green-600 text-white hover:bg-green-700 rounded-xl px-4 py-2 shadow-md"
                        >
                            Marcar como resuelto
                        </Button>
                    </div>
                )}

                {/* Espacio para modales, captcha, etc */}
                {children}
            </CardContent>
        </Card>
    );
}