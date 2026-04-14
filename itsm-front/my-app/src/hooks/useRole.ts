import { useUserAuthStore } from "../store/useUserAuthStore";

export const useRole = () => {
    const { currentUser } = useUserAuthStore();

    const hasAccess = (roles?: string[]) => {
        if (!currentUser) return false;
        if (!roles) return true;

        const requiredRoles = Array.isArray(roles) ? roles : [roles];

        return requiredRoles.some((role) => currentUser.role.name === role);
    }

    return {
        hasAccess
    }
};

