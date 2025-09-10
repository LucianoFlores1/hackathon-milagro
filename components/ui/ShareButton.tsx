import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

export type ShareButtonProps = {
    postId: string;
    postTitle: string;
};

export default function ShareButton({ postId, postTitle }: ShareButtonProps) {
    // Evita error SSR: window solo existe en cliente
    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/posts/${postId}` : "";

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: postTitle,
                    url: shareUrl,
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareUrl);
                alert("Enlace copiado al portapapeles!");
            } catch (err) {
                console.error("Error copiando enlace:", err);
            }
        }
    };

    return (
        <Button onClick={handleShare} className="flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Compartir
        </Button>
    );
}
