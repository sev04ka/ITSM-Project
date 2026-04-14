import { type FC, type ReactNode } from 'react';
import { useRole } from '../../hooks/useRole';

interface RoleGuardProps {
    children: ReactNode;
    roles: string[];
}



const RoleGuard: FC<RoleGuardProps> = ({
    children,
    roles
}) => {
    const { hasAccess } = useRole();

    if (hasAccess(roles)) {
        return children;
    }

    return (
        <div>Нет доступа</div>
    )
};

export default RoleGuard