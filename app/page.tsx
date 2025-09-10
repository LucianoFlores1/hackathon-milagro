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
import PostCard from "@/components/ui/PostCard"
import Alert from "@/components/ui/Alert"
import { PostSkeleton } from "@/components/ui/PostSkeleton"
import { useRouter } from "next/navigation";
import { span } from "framer-motion/client"

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdPostId, setCreatedPostId] = useState<string | null>(null);
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
  const [navigating, setNavigating] = useState(false);
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

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
    // Validaciones
    const errors: { [key: string]: string } = {};
    if (!title.trim()) errors.title = "El título es obligatorio.";
    if (!description.trim()) errors.description = "La descripción es obligatoria.";
    if (!contactValue.trim()) errors.contactValue = "El contacto es obligatorio.";
    if (eventDate && new Date(eventDate) > new Date()) errors.eventDate = "La fecha no puede ser futura.";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setAlert({ type: "error", message: "Por favor corrige los errores marcados." });
      return;
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
    const { data: insertData, error } = await supabase.from("posts").insert({
      title,
      description,
      status,
      species,
      zone_text: zoneText,
      event_date: eventDate,
      contact_type: contactType,
      contact_value: contactValue,
      image_url: imageUrl,
    }).select();
    if (error) {
      setAlert({ type: "error", message: "Error al crear el post. Intenta de nuevo." })
    } else {
      // Obtener el id del post recién creado
      const newId = insertData?.[0]?.id;
      setCreatedPostId(newId || null);
      setShowSuccessModal(true);
      setTitle("");
      setDescription("");
      setStatus("lost");
      setSpecies("dog");
      setZoneText("");
      setEventDate("");
      setContactType("whatsapp");
      setContactValue("");
      setImageFile(null);
      setPage(0);

      // Refresca los posts inmediatamente
      setLoading(true);
      const query = supabase.from("posts").select("*");
      const start = 0;
      const end = PAGE_SIZE - 1;
      const { data, error: fetchError } = await query
        .order("created_at", { ascending: false })
        .range(start, end);
      if (!fetchError && data) {
        setPosts(data as Post[]);
        setHasMore(data.length === PAGE_SIZE);
      }
      setLoading(false);
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
      {/* Modal de éxito al crear post */}
      {showSuccessModal && (
        <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center max-w-sm mx-auto transform transition-all duration-300 scale-100 hover:scale-[1.01]">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2 text-center">¡Publicación creada con éxito!</h2>
            <p className="mb-6 text-center text-gray-700">Tu aviso se publicó correctamente.</p>
            <Button
              className="w-full mb-2"
              onClick={() => {
                if (createdPostId) {
                  setShowSuccessModal(false);
                  router.push(`/posts/${createdPostId}`);
                }
              }}
            >
              Ver mi publicación
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowSuccessModal(false)}
            >
              Cerrar
            </Button>
          </div>
        </div>
      )}
      {navigating && (
        <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <Spinner />
          </div>
        </div>
      )}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">🐾 Amigos Fieles</h1>
          <nav className="space-x-4">
            <Link href="/" className="text-gray-700 hover:text-blue-600">Inicio</Link>
            <button onClick={() => {
              setShowForm(true);
              setTimeout(() => {
                const el = document.getElementById("create-post");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }, 50);
            }} className="bg-blue-600 text-white w-full md:w-auto mt-2 md:mt-0 rounded-xl px-4 py-2 shadow-md 
            hover:shadow-lg hover:scale-[1.02] 
            transition-all duration-300">Publicar</button>
          </nav>
        </div>
      </header>
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

      <Card className={`p-0 transition-max-height duration-500 overflow-hidden ${showForm ? "max-h-[1200px]" : "max-h-15"} `}
      >
        <Button
          variant="outline"
          className="rounded-xl px-4 py-2 shadow-md 
             hover:shadow-lg hover:scale-[1.02] 
             transition-all duration-300"
          onClick={() => setShowForm(!showForm)}>

          {showForm ? "Ocultar formulario de publicación" : "➕ Publicar un aviso"}
        </Button>
        {showForm && (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-2xl font-semibold text-center">Publicar un Aviso</h2>
            <form id="create-post" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título <span className="text-red-500" aria-label="obligatorio">*</span>
                  </Label>
                  <Input className={fieldErrors.title ? "border-red-500 focus:border-red-500" : ""} id="title" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} aria-invalid={!!fieldErrors.title} aria-describedby={fieldErrors.title ? "title-error" : undefined} />
                  {fieldErrors.title && (
                    <span id="error-title" className="text-xs text-red-600" role="alert">{fieldErrors.title}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Foto</Label>
                  <Input
                    className="rounded-lg border-gray-300 focus:border-blue-500 
             focus:ring focus:ring-blue-200 transition duration-200"
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setImagePreview(null);
                        setImageFile(null);
                      }
                    }}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Vista previa" className="w-full max-h-48 object-contain rounded-lg border" />
                      <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => { setImagePreview(null); setImageFile(null); }}>
                        Quitar imagen
                      </Button>
                    </div>
                  )}
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
                <Label htmlFor="description">Descripción <span className="text-red-500" aria-label="obligatorio">*</span></Label>
                <Textarea id="description" placeholder="Descripción detallada de tu mascota..." value={description} onChange={(e) => setDescription(e.target.value)} aria-invalid={!!fieldErrors.description}
                  aria-describedby={fieldErrors.description ? "error-description" : undefined}
                  className={fieldErrors.description ? "border-red-500 focus:border-red-500" : ""}
                />
                {fieldErrors.description && (
                  <span id="error-description" className="text-xs text-red-600" role="alert">
                    {fieldErrors.description}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zone">Zona aproximada</Label>
                  <Input className="rounded-lg border-gray-300 focus:border-blue-500 
             focus:ring focus:ring-blue-200 transition duration-200" id="zone" placeholder="Ej: Cerrillos" value={zoneText} onChange={(e) => setZoneText(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-date">Fecha del hecho</Label>
                  <Input id="event-date"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    aria-invalid={!!fieldErrors.eventDate}
                    aria-describedby={fieldErrors.eventDate ? "error-event-date" : undefined}
                    className={fieldErrors.eventDate ? "border-red-500 focus:border-red-500" : "rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"}
                  />
                  {fieldErrors.eventDate && (
                    <span id="error-event-date" className="text-xs text-red-600" role="alert">
                      {fieldErrors.eventDate}
                    </span>
                  )}
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
                <Input id="contact-value" placeholder="Ej: 3811234567 o email@ejemplo.com" value={contactValue} onChange={(e) => setContactValue(e.target.value)} aria-invalid={!!fieldErrors.contactValue}
                  aria-describedby={fieldErrors.contactValue ? "error-contact-value" : undefined}
                  className={fieldErrors.contactValue ? "border-red-500 focus:border-red-500" : "rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"}
                />
                {fieldErrors.contactValue && (
                  <span id="error-contact-value" className="text-xs text-red-600" role="alert">
                    {fieldErrors.contactValue}
                  </span>
                )}
              </div>
              <Button type="submit" disabled={loading} className="rounded-xl px-4 py-2 shadow-md 
             hover:shadow-lg hover:scale-[1.02] 
             transition-all duration-300">
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

      {/* Taerjeta de busqueda y los filtros */}
      <Card className="p-3 rounded-xl shadow-md hover:shadow-lg 
             hover:scale-[1.02] transition-all duration-300">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="space-y-2 flex-grow">
              <Label htmlFor="search">Buscar por título o descripción</Label>
              <Input
                className="rounded-lg border-gray-300 focus:border-blue-500 
             focus:ring focus:ring-blue-200 transition duration-200"
                id="search"
                placeholder="Puede que alguien haya encontrado a tu mascota, prueba suerte..."
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
            <Button onClick={handleClearFilters} className="w-full md:w-auto mt-2 md:mt-0 rounded-xl px-4 py-2 shadow-md 
             hover:shadow-lg hover:scale-[1.02] 
             transition-all duration-300" variant={"default"} >
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
            <div key={post.id} onClick={() => {
              setNavigating(true);
              router.push(`/posts/${post.id}`);
            }}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-4 rounded-xl px-4 py-2 hover:shadow-lg hover:scale-[1.02] 
             transition-all duration-300">
          <Button onClick={() => setPage(page + 1)} disabled={loading}>
            {loading ? <Spinner /> : "Cargar más posts"}
          </Button>
        </div>
      )}
      <footer className="mt-12 bg-gray-100 py-4 text-center text-sm text-gray-600">
        © 2025 Milagro Pets – Hackathon del Milagro 🐶🐱
      </footer>

    </div>
  );
}