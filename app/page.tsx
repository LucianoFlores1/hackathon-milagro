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
import { Dog, Cat, PawPrint, MapPin, Calendar, MessageCircle, Mail } from "lucide-react"

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
}

const PAGE_SIZE = 10;

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
      setMessage("El título y la descripción son obligatorios.")
      return
    }
    if (!contactValue.trim()) {
      setMessage("❌ Debes ingresar un valor de contacto.")
      return
    }
    if (eventDate && new Date(eventDate) > new Date()) {
      setMessage("❌ La fecha no puede ser futura.")
      return
    }

    setLoading(true)
    setMessage(null)

    const { error } = await supabase.from("posts").insert({
      title,
      description,
      status,
      species,
      zone_text: zoneText, // Agregado
      event_date: eventDate, // Agregado
      contact_type: contactType, // Agregado
      contact_value: contactValue // Agregado
    })
    if (error) {
      setMessage("❌ Error al crear el post. Intenta de nuevo.")
    } else {
      setMessage("✅ Post creado exitosamente.")
      setTitle("")
      setDescription("")
      setStatus("lost")
      setSpecies("dog")
      setZoneText("") // Agregado
      setEventDate("") // Agregado
      setContactType("whatsapp") // Agregado
      setContactValue("") // Agregado
      setPage(0);
      /* Original metodo de refresco de la pagina al publicar -> const { data } = await supabase.from("posts").select("*").order("id", { ascending: false })
      if (data) setPosts(data as Post[]) */
    }

    setLoading(false)
  }

  const handleClearFilters = () => {
    setFilterStatus("all");
    setFilterSpecies("all");
    setSearchTerm("");
    setPage(0);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center">Mascotas Perdidas y Encontradas</h1>

      {message && (
        <p
          className={`text-sm text-center ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}
        >{message}</p>
      )}

      <div className="bg-gray-100 p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-semibold text-center">Publicar un Nuevo Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
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
            {loading ? "Creando..." : "Crear Post"}
          </Button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Posts Recientes</h2>
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="space-y-2 flex-grow">
            <Label htmlFor="search">Buscar por título o descripción</Label>
            <Input
              id="search"
              placeholder="Buscar por título o descripción..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0); // Reiniciar paginación al buscar
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-status">Filtrar por estado</Label>
            <Select value={filterStatus} onValueChange={(value) => {
              setFilterStatus(value);
              setPage(0); // Reiniciar paginación al filtrar
            }}>
              <SelectTrigger id="filter-status"><SelectValue placeholder="Todos" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="lost">Perdido</SelectItem>
                <SelectItem value="found">Encontrado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-species">Filtrar por especie</Label>
            <Select value={filterSpecies} onValueChange={(value) => {
              setFilterSpecies(value);
              setPage(0); // Reiniciar paginación al filtrar
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
          <Button onClick={handleClearFilters} className="self-end md:w-auto">
            Limpiar filtros
          </Button>
        </div>
      </div>

      <div className="space-y-4 mt-8">
        {posts.map((post) => (
          <Card key={post.id} className="shadow-md">
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
              <p>{post.description}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {post.species === "dog" ? <Dog size={16} /> : post.species === "cat" ? <Cat size={16} /> : <PawPrint size={16} />}
                <span>Especie: {post.species}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin size={16} />
                <span>Zona: {post.zone_text}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar size={16} />
                <span>Fecha del hecho: {new Date(post.event_date).toLocaleDateString()}</span>
              </div>
              {(post.contact_type || post.contact_value) && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  {post.contact_type === "whatsapp" ? <MessageCircle size={16} /> : <Mail size={16} />}
                  <span>
                    Contacto:
                    {post.contact_type === "whatsapp" ? (
                      <a href={`https://wa.me/${post.contact_value}`} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-500 underline">
                        {post.contact_value}
                      </a>
                    ) : (
                      <a href={`mailto:${post.contact_value}`} className="ml-1 text-blue-500 underline">
                        {post.contact_value}
                      </a>
                    )}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button onClick={() => setPage(page + 1)} disabled={loading}>
            {loading ? "Cargando..." : "Cargar más posts"}
          </Button>
        </div>
      )}
    </div>
  );
}