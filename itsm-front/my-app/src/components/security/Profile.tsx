import { type FC, useEffect, useState } from 'react';
import { useUserAuthStore } from '../../store/useUserAuthStore';




const Profile: FC = () => {
    const { currentUser } = useUserAuthStore()

    if (!currentUser) {
        return <div>Пользователь не найден</div>;
    }

    return (
        <div>
            <p>{currentUser.first_name}</p>
            <p>{currentUser.last_name}</p>
            <p>{currentUser.role.name}</p>
            <p>{currentUser.organization.name}</p>
        </div>
    )
}

export default Profile
