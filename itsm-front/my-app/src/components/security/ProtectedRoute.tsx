import type { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
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

    const { currentUser, isInitialized, loading } = useUserAuthStore();

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (!isInitialized) {
        return <div>Ошибка инициализации</div>
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (!roles) {
        return children;
    }

    return (
        <RoleGuard children={children} roles={roles}></RoleGuard>
    )
};

export default ProtectedRoute