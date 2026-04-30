import type { FC, ReactNode } from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { useUserAuthStore } from '../../store/useUserAuthStore';
import RoleGuard from './RoleGuard';

interface ProtectedRouteProps {
    children: ReactNode;
    roles?: string[];
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({
    children,
    roles,
}) => {
    const [searchParams] = useSearchParams()
    const { currentUser, isInitialized, loading, error } = useUserAuthStore();
    const location = useLocation();

    if (!isInitialized || loading) {
        return <div>Загрузка...</div>;
    }


    if (!currentUser) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    if (!roles) {
        return children;
    }

    return (
        <RoleGuard children={children} roles={roles}></RoleGuard>
    )
};

export default ProtectedRoute