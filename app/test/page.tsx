import { supabase } from "@/lib/supabase"

export default async function Home() {
    const { data: posts } = await supabase.from("posts").select("*").limit(5)

    return (
        <main className="flex min-h-screen items-center justify-center flex-col gap-4">
            <pre>{JSON.stringify(posts, null, 2)}</pre>
        </main>
    )
}
