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
            path: '/tickets',
            title: 'Tickets',
        },
        {
            path: '/conf-items-management',
            title: 'Configuration items management',
            roles: ['admin']
        },
        {
            path: '/conf-items-management/add',
            title: 'Add configuration item',
            roles: ['admin']
        },
        {
            path: '/my-conf-items',
            title: 'My configuration items',
        },
        {
            path: '/requests',
            title: 'my tickets',
        },
        {
            path: '/tickets/create',
            title: 'create ticket',
        }
    ]

    const visibleMenuItems = navMenuItems.filter((item) => hasAccess(item.roles))

    return (
        <div className={styles.sidebar}>
            <div className={styles["org-label"]}>
                <h2>
                    {currentUser?.organization.name}
                </h2>
            </div>
            <nav>
                {visibleMenuItems.map(item => <SideBarNavItem key={crypto.randomUUID()} {...item} />)}
            </nav>
        </div>
    )
}

export default SideBar
