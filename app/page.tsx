"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
        <input
          className="border p-2 w-full"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className="border p-2 w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="lost">Perdido</option>
          <option value="found">Encontrado</option>
        </select>
        <select
          className="border p-2 w-full"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
        >
          <option value="dog">Perro</option>
          <option value="cat">Gato</option>
          <option value="other">Otro</option>
        </select>
        <Button type="submit">Crear post</Button>
      </form>

      {/* Lista de posts con tarjeta esta vez*/}
      <div className="space-y-4">
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
