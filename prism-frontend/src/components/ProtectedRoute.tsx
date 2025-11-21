import { Navigate, Outlet } from "react-router-dom"
import { useApi } from "../context/api-context"

export function ProtectedRoute() {
    const { user, isLoading } = useApi()

    if (isLoading && !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}
