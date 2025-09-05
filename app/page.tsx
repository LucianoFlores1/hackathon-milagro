"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function TestPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [posts, setPosts] = useState<any[]>([])

  // Traer posts al cargar la página
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from("posts").select("*").order("id", { ascending: false })
      if (!error && data) setPosts(data)
    }
    fetchPosts()
  }, [])

  // Insertar post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from("posts").insert([{ title, description }])
    if (!error) {
      setTitle("")
      setDescription("")
      // refrescar la lista sin recargar la página
      const { data } = await supabase.from("posts").select("*").order("id", { ascending: false })
      if (data) setPosts(data)
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
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Publicar
        </button>
      </form>

      {/* Lista de posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded">
            <h3 className="font-bold">{post.title}</h3>
            <p>{post.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
