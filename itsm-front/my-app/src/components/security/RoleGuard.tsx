import { type FC, type ReactNode } from 'react';
import { useRole } from '../../hooks/useRole';

interface RoleGuardProps {
    children: ReactNode;
    roles: string[];
    hideMode?: boolean;
}



const RoleGuard: FC<RoleGuardProps> = ({
    children,
    roles,
    hideMode = false
}) => {
    const { hasAccess } = useRole();

    if (hasAccess(roles)) {
        return children;
    }

    if (hideMode) return <></>

    if (!hideMode) return <div>Нет доступа</div>
};

export default RoleGuard