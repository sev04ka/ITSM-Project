import type { FC } from 'react';
import Auth from '../Auth';
import { Navigate } from 'react-router-dom';
import { useUserAuthStore } from '../store/useUserAuthStore';


const Login: FC<any> = ({ }) => {
    const { currentUser } = useUserAuthStore()

    if (currentUser) {
        return <Navigate to="/" replace />;
    }

    return (
        <div>
            <Auth />
        </div>
    )
}

export default Login
