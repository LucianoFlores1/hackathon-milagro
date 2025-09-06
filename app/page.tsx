"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select"

type Post = {
  id: string
  title: string
  description: string
  status: string
  species: string
}

export default function TestPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("lost") // Nuevo estado
  const [species, setSpecies] = useState("dog") // Nuevo estado
  const [posts, setPosts] = useState<Post[]>([])

  // Traer posts al cargar la página
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from("posts").select("*").order("id", { ascending: false })
      if (!error && data) setPosts(data as Post[])
    }
    fetchPosts()
  }, [])

  // Insertar post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from("posts").insert({
      title,
      description,
      status,
      species,
      zone_text: "Zona de prueba",
      contact_type: "whatsapp",
      contact_value: "https://wa.me/549381000000"
    })
    if (!error) {
      setTitle("")
      setDescription("")
      setStatus("lost")
      setSpecies("dog")
      // Después de insertar, volver a traer los posts para
      // refrescar la lista sin recargar la página
      const { data } = await supabase.from("posts").select("*").order("id", { ascending: false })
      if (data) setPosts(data as Post[])
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Selecciona el estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lost">Perdido</SelectItem>
              <SelectItem value="found">Encontrado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label htmlFor="species">Especie</label>
          <Select value={species} onValueChange={setSpecies}>
            <SelectTrigger id="species">
              <SelectValue placeholder="Selecciona la especie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dog">Perro</SelectItem>
              <SelectItem value="cat">Gato</SelectItem>
              <SelectItem value="other">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Crear post</Button>
      </form>

      {/* Lista de posts con tarjeta esta vez*/}
      <div className="space-y-4 mt-8">
        {posts.map((post) => (
          <Card key={post.id} className="shadow-md">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>{post.description}</p>
              <p className="text-sm text-gray-600">Estado: {post.status}</p>
              <p className="text-sm text-gray-600">Especie: {post.species}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
