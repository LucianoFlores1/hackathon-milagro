import { Card, CardContent } from "@/components/ui/card"

export function PostSkeleton() {
    return (
        <Card className="rounded-2xl shadow-sm">
            <div className="w-full h-48 bg-gray-200 animate-pulse rounded-t-2xl" />
            <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
            </CardContent>
        </Card>
    )
}
