import type { FC } from 'react';
import { type IMenuItem, SideBarNavItem } from './SideBarNavItem';
import { useRole } from '../../../hooks/useRole';
import styles from './sidebar.module.css'
import { useUserAuthStore } from '../../../store/useUserAuthStore';

const SideBar: FC = () => {
    const { currentUser } = useUserAuthStore()
    const { hasAccess } = useRole()

    const navMenuItems: IMenuItem[] = [
        {
            path: '/conf-items-management',
            title: 'Конфигурации',
            roles: ['admin', 'support'],
            icon: '\u2699'
        },
        {
            path: '/users',
            title: 'Пользователи',
            roles: ['super-admin', 'admin'],
            icon: '\u2731'
        },
        {
            path: '/organizations',
            title: 'Организации',
            roles: ['super-admin'],
            icon: '\u2302'
        },
        {
            path: '/tickets',
            title: 'Заявки',
            roles: ['admin', 'support'],
            icon: '\u2302'
        },
        {
            path: '/my-tickets',
            title: 'Мои заявки',
            roles: ['admin', 'support', 'user'],
            icon: '\u2302'
        },
    ]

    const visibleMenuItems = navMenuItems.filter((item) => hasAccess(item.roles))

    return (
        <div className={styles.sidebar}>
            <div className={styles["org-label-container"]}>
                <div className={styles["org-label"]}>
                    {currentUser?.organization.name}
                </div>
            </div>
            <nav>
                {visibleMenuItems.map(item => <SideBarNavItem key={item.path} {...item} />)}
            </nav>
        </div>
    )
}

export default SideBar
