import type { FC } from 'react';
import { useRole } from '../../../hooks/useRole';
import styles from './sidebar.module.css'
import { useUserAuthStore } from '../../../store/useUserAuthStore';
import { links } from '../../../consts/MenuLinks';
import { SideBarNavItem } from './SideBarNavItem';

export const SideBar: FC = () => {
    const { currentUser } = useUserAuthStore()
    const { hasAccess } = useRole()

    const visibleMenuItems = links.filter((item) => hasAccess(item.roles) && !item.exclude)

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
