"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PostCard from "@/components/ui/PostCard";
import { PostSkeleton } from "@/components/ui/PostSkeleton";
import { Spinner } from "@/components/ui/Spinner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import type { Post as PostType } from "@/components/ui/PostCard";

const PAGE_SIZE = 12;

export default function PerdidosPage() {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterSpecies, setFilterSpecies] = useState("all");
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            let query = supabase.from("posts").select("*").eq("status", "lost");
            if (filterSpecies !== "all") {
                query = query.eq("species", filterSpecies);
            }
            if (searchTerm) {
                query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
            }
            const start = page * PAGE_SIZE;
            const end = start + PAGE_SIZE - 1;
            const { data, error } = await query
                .order("created_at", { ascending: false })
                .range(start, end);
            if (!error && data) {
                if (page === 0) setPosts(data as PostType[]);
                else setPosts((prev) => [...prev, ...(data as PostType[])]);
                setHasMore((data as PostType[]).length === PAGE_SIZE);
            }
            setLoading(false);
        };
        fetchData();
    }, [searchTerm, filterSpecies, page]);

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            {/* Filtros */}
            <Card className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-200">
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end gap-6">
                        <div className="space-y-2 flex-grow">
                            <Label htmlFor="search" className="font-semibold text-blue-700 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" /></svg>
                                Buscar por título o descripción
                            </Label>
                            <Input
                                className="rounded-xl border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200 bg-white shadow-sm px-4 py-2"
                                id="search"
                                placeholder="Ej: Firulais perdido..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                            />
                        </div>
                        <div className="space-y-2 w-full md:w-44">
                            <Label htmlFor="filter-species" className="font-semibold text-blue-700 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                                Especie
                            </Label>
                            <Select value={filterSpecies} onValueChange={(v) => { setFilterSpecies(v); setPage(0); }}>
                                <SelectTrigger id="filter-species" className="rounded-xl border-blue-300 focus:border-blue-500 bg-white shadow-sm px-4 py-2">
                                    <SelectValue placeholder="Todas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas</SelectItem>
                                    <SelectItem value="dog">Perro</SelectItem>
                                    <SelectItem value="cat">Gato</SelectItem>
                                    <SelectItem value="other">Otro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="w-full md:w-auto mt-2 md:mt-0 rounded-xl px-4 py-2 shadow-md bg-blue-500 text-white font-semibold hover:bg-blue-600 hover:scale-105 transition-all duration-300"
                            onClick={() => { setSearchTerm(""); setFilterSpecies("all"); setPage(0); }}>
                            Limpiar filtros
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Grid */}
            {loading && page === 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <PostSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} href={`/posts/${post.id}`} />
                    ))}
                </div>
            )}

            {hasMore && (
                <div className="flex justify-center mt-4 rounded-xl px-4 py-2 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                    <Button onClick={() => setPage((p) => p + 1)} disabled={loading}>
                        {loading ? <Spinner /> : "Cargar más"}
                    </Button>
                </div>
            )}

            <footer className="mt-12 bg-gray-100 py-4 text-center text-sm text-gray-600">
                © 2025 Mascotas del Milagro – Mi Amigo Fiel 🐶🐱
            </footer>
        </div>
    );
}
