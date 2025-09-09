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
import { Badge } from "@/components/ui/badge"
import { Dog, Cat, PawPrint, MapPin, Calendar, MessageCircle, Mail, Loader2 } from "lucide-react"
import Link from "next/link"
import { Spinner } from "@/components/ui/Spinner"
import Alert from "@/components/ui/Alert"
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
  created_at: string
  image_url: string | null
}

const PAGE_SIZE = 10;

const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.44); // Promedio de días en un mes

  if (minutes < 1) return "hace unos segundos";
  if (minutes < 60) return `hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
  if (hours < 24) return `hace ${hours} hora${hours > 1 ? "s" : ""}`;
  if (days < 30) return `hace ${days} día${days > 1 ? "s" : ""}`;
  if (months < 12) return `hace ${months} mes${months > 1 ? "es" : ""}`;
  return date.toLocaleDateString();
};

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
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterSpecies, setFilterSpecies] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // posts filtrados en memoria
  const filteredPosts = posts.filter((post) => {
    const matchStatus =
      filterStatus === "all" ? true : post.status === filterStatus
    const matchSpecies =
      filterSpecies === "all" ? true : post.species === filterSpecies
    return matchStatus && matchSpecies
  })

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      let query = supabase.from("posts").select("*")

      // Aplica el filtro de estado si está activo
      if (filterStatus && filterStatus !== "all") {
        query = query.eq("status", filterStatus)
      }

      // Aplica el filtro de especie si está activo
      if (filterSpecies && filterSpecies !== "all") {
        query = query.eq("species", filterSpecies)
      }

      // 🔍 Agrega el filtro de búsqueda de texto
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      }

      const start = page * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      const { data, error } = await query
        .order("created_at", { ascending: false })
        .range(start, end);

      if (!error && data) {
        if (page === 0) {
          setPosts(data as Post[])
        } else {
          setPosts((prevPosts) => [...prevPosts, ...(data as Post[])])
        }
        setHasMore(data.length === PAGE_SIZE);
      }

      setLoading(false);
    }
    fetchPosts()
  }, [filterStatus, filterSpecies, searchTerm, page])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 🔎 Validaciones simples
    if (!title.trim() || !description.trim()) {
      setAlert({ type: "error", message: "El título y la descripción son obligatorios." })
      return
    }
    if (!contactValue.trim()) {
      setAlert({ type: "error", message: "Debes ingresar un valor de contacto." })
      return
    }
    if (eventDate && new Date(eventDate) > new Date()) {
      setAlert({ type: "error", message: "La fecha no puede ser futura." })
      return
    }

    setLoading(true);
    setMessage(null);

    let imageUrl = null;

    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`
      const filePath = `images/${fileName}` // usamos este

      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(filePath, imageFile, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        console.error("Error en upload:", uploadError.message)
        setAlert({ type: "error", message: "Error al subir la imagen. Intenta de nuevo." })
        setLoading(false)
        return
      }

      // Obtener la URL pública de la imagen
      const { data } = supabase.storage
        .from("post-images")
        .getPublicUrl(filePath)

      if (data?.publicUrl) {
        imageUrl = data.publicUrl
      }
    }
    const { error } = await supabase.from("posts").insert({
      title,
      description,
      status,
      species,
      zone_text: zoneText, // Agregado
      event_date: eventDate, // Agregado
      contact_type: contactType, // Agregado
      contact_value: contactValue, // Agregado
      image_url: imageUrl, // 👈 nueva columna
    })
    if (error) {
      setAlert({ type: "error", message: "Error al crear el post. Intenta de nuevo." })
    } else {
      setAlert({ type: "success", message: "Post creado exitosamente." })
      setTitle("")
      setDescription("")
      setStatus("lost")
      setSpecies("dog")
      setZoneText("") // Agregado
      setEventDate("") // Agregado
      setContactType("whatsapp") // Agregado
      setContactValue("") // Agregado
      setImageFile(null); // Limpiar el archivo de imagen
      setPage(0);

      // Refresca los posts inmediatamente
      // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
      setLoading(true)
      const query = supabase.from("posts").select("*")
      const start = 0
      const end = PAGE_SIZE - 1
      const { data, error: fetchError } = await query
        .order("created_at", { ascending: false })
        .range(start, end)
      if (!fetchError && data) {
        setPosts(data as Post[])
        setHasMore(data.length === PAGE_SIZE)

      }
      setLoading(false)
      // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    }
    setLoading(false);
  }
  const handleClearFilters = () => {
    setFilterStatus("all");
    setFilterSpecies("all");
    setSearchTerm("");
    setPage(0);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <h1 className="text-3xl font-bold text-center">Mascotas Perdidas y Encontradas</h1>

      {message && (
        <p
          className={`text-sm text-center ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}
        >{message}</p>
      )}

      <Card className={`transition-max-height duration-500 overflow-hidden ${showForm ? "max-h-[1000px]" : "max-h-0"} `}
      >
        <Button
          variant="outline"
          className="mb-4 w-full"
          onClick={() => setShowForm(!showForm)}>

          {showForm ? "Ocultar formulario de publicación" : "➕ Publicar un aviso"}
        </Button>
        {showForm && (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-2xl font-semibold text-center">Publicar un Nuevo Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input id="title" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Foto</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setImageFile(file)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status"><SelectValue placeholder="Selecciona el estado" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lost">Perdido</SelectItem>
                      <SelectItem value="found">Encontrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="species">Especie</Label>
                  <Select value={species} onValueChange={setSpecies}>
                    <SelectTrigger id="species"><SelectValue placeholder="Selecciona la especie" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Perro</SelectItem>
                      <SelectItem value="cat">Gato</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" placeholder="Descripción detallada del animal..." value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <SelectTrigger id="contact-type"><SelectValue placeholder="Selecciona el tipo de contacto" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="form">Formulario</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-value">Valor de contacto</Label>
                <Input id="contact-value" placeholder="Ej: 3811234567 o email@ejemplo.com" value={contactValue} onChange={(e) => setContactValue(e.target.value)} />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  "Publicar"
                )}
              </Button>
            </form>
          </div>
        )}
      </Card>

      <Card className="p-4 shadow-md">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="space-y-2 flex-grow">
              <Label htmlFor="search">Buscar por título o descripción</Label>
              <Input
                id="search"
                placeholder="Buscar por título o descripción..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
              />
            </div>
            <div className="flex gap-4 w-full">
              {/* Filtro por estado */}
              <div className="space-y-2 w-full md:w-40">
                <Label htmlFor="filter-status">Estado</Label>
                <Select value={filterStatus} onValueChange={(value) => {
                  setFilterStatus(value);
                  setPage(0);
                }}>
                  <SelectTrigger id="filter-status"><SelectValue placeholder="Todos" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="lost">Perdido</SelectItem>
                    <SelectItem value="found">Encontrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Filtro por especie */}
              <div className="space-y-2 w-full md:w-40">
                <Label htmlFor="filter-species">Especie</Label>
                <Select value={filterSpecies} onValueChange={(value) => {
                  setFilterSpecies(value);
                  setPage(0);
                }}>
                  <SelectTrigger id="filter-species"><SelectValue placeholder="Todas" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="dog">Perro</SelectItem>
                    <SelectItem value="cat">Gato</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Botón limpiar */}
            <Button onClick={handleClearFilters} className="w-full md:w-auto mt-2 md:mt-0" variant={"default"} >
              Limpiar filtros
            </Button>
          </div>
        </div>
      </Card>
      <h2 className="text-2xl font-bold">Posts Recientes</h2>
      {/* Solo renderiza los posts o skeletons una vez, según el estado de loading */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`}>
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
            </Link>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button onClick={() => setPage(page + 1)} disabled={loading}>
            {loading ? <Spinner /> : "Cargar más posts"}
          </Button>
        </div>
      )}
    </div>
  );
}