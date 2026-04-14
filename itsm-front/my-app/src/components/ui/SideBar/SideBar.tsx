import type { FC } from 'react';
import { type IMenuItem, SideBarNavItem } from './SideBarNavItem';
import './sidebar.css'
import { useRole } from '../../../hooks/useRole';

const SideBar: FC = () => {
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
        <div className='sidebar'>
            {visibleMenuItems.map(item => <SideBarNavItem key={crypto.randomUUID()} {...item} />)}
        </div>
    )
}

export default SideBar
