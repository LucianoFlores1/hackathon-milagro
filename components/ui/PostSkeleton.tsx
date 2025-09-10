import { Card, CardContent } from "@/components/ui/card"

export function PostSkeleton() {
    return (
        <div className="rounded-lg bg-gray-100 p-4 shadow animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-2/3 mb-4" />
            <div className="h-48 bg-gray-300 rounded mb-4" />
            <div className="h-4 bg-gray-300 rounded w-full mb-2" />
            <div className="h-4 bg-gray-300 rounded w-5/6 mb-2" />
            <div className="h-4 bg-gray-300 rounded w-4/6 mb-2" />
            <div className="flex gap-2 mt-4">
                <div className="h-6 w-20 bg-gray-300 rounded" />
                <div className="h-6 w-20 bg-gray-300 rounded" />
                <div className="h-6 w-20 bg-gray-300 rounded" />
            </div>
        </div>
    )
}
