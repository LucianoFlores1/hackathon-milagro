"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dog, Cat, PawPrint, MapPin, Calendar, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Spinner } from "@/components/ui/Spinner"
import { PostSkeleton } from "@/components/ui/PostSkeleton"
import ShareButton from "@/components/ui/ShareButton"
import { Adoption } from "@/types/adoption"

function ContactButton({ type, value }: { type?: string; value?: string }) {
  if (!value) return null
  if (type === "whatsapp") {
    return (
      <Button asChild className="w-full">
        <a href={`https://wa.me/${value}`} target="_blank" rel="noopener noreferrer">Contactar por WhatsApp</a>
      </Button>
    )
  }
  if (type === "email") {
    return (
      <Button asChild className="w-full">
        <a href={`mailto:${value}`}>Enviar correo</a>
      </Button>
    )
  }
  return null
}

export default function AdoptionDetail() {
  const params = useParams()
  const router = useRouter()
  const [adoption, setAdoption] = useState<Adoption | null>(null)
  const [navigating, setNavigating] = useState(false)

  useEffect(() => {
    const fetchAdoption = async () => {
      const { data } = await supabase.from("adoptions").select("*").eq("id", params.id).single()
      setAdoption(data as Adoption)
    }
    fetchAdoption()
  }, [params.id])

  if (!adoption) {
    return (
      <div className="p-6 space-y-6 max-w-2xl mx-auto relative">
        <div className="flex items-center justify-center min-h-[300px]">
          <PostSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto relative">
      {navigating && (
        <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <Spinner />
          </div>
        </div>
      )}
      <Link href="/adopciones">
        <Button variant="outline" className="mb-4" onClick={() => { setNavigating(true); router.back(); }}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Adopciones
        </Button>
      </Link>

      <Card className="relative overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {adoption.name}
            <Badge
              variant="outline"
              className={`${adoption.status === "adopted" ? "bg-green-600 text-white" : "bg-blue-600 text-white"}`}
            >
              {adoption.status === "adopted" ? "Adoptado" : "Disponible"}
            </Badge>
          </CardTitle>
          <div className="mt-2">
            <ShareButton postId={adoption.id} postTitle={adoption.name} />
          </div>
        </CardHeader>

        {/* Cinta si está adoptado */}
        {adoption.status === "adopted" && (
          <div className="absolute top-8 left-[-60px] rotate-[-20deg] w-[300px] bg-green-600 text-white text-center py-2 font-bold shadow-lg z-20">
            ¡Este perrito fue adoptado!
          </div>
        )}

        {/* Cartel de revisión por reportes (si la columna existe y está activa) */}
        {adoption.contact_hidden && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center w-full h-full pointer-events-none">
            <div className="bg-yellow-200 bg-opacity-80 rounded-lg px-8 py-6 text-center shadow-xl">
              <span className="text-yellow-800 font-bold text-xl text-center px-4">
                Esta publicación está en revisión por la comunidad.<br />
                El contacto se ha ocultado temporalmente.
              </span>
            </div>
          </div>
        )}

        <CardContent className={`${adoption.contact_hidden ? "blur-sm grayscale opacity-80 pointer-events-none" : ""} space-y-4`}>
          {adoption.image_url && (
            <img
              src={adoption.image_url}
              alt={adoption.name}
              className="w-full max-h-[500px] object-contain rounded-md"
            />
          )}

          <p className="text-gray-800">{adoption.description}</p>

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
              {new Date(adoption.created_at).toLocaleDateString()}
            </Badge>
          </div>

          {/* Botón de contacto (si no está adoptado ni oculto) */}
          {adoption.contact_type && adoption.contact_value && adoption.status !== "adopted" && !adoption.contact_hidden && (
            <div className="pt-4">
              <ContactButton type={adoption.contact_type} value={adoption.contact_value} />
            </div>
          )}

          {adoption.status === "adopted" && (
            <div className="pt-4">
              <div className="bg-gray-200 text-gray-500 rounded-lg p-4 text-center font-semibold">
                El contacto fue bloqueado porque la mascota ya fue adoptada.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
