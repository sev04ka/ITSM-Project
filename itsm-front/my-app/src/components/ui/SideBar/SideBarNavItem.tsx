import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './sidebar.module.css'

interface IMenuItem {
    title: string,
    path: string,
    roles?: string[],
    icon?: string
}

interface IProps extends IMenuItem { }


const SideBarNavItem: FC<IProps> = ({
    title,
    path,
    icon
}) => {
    return (
        <NavLink
            to={path}
            className={({ isActive }) =>
                isActive ? styles.active : ''
            }
        >
            {icon && <span className={styles["nav-icon"]}>{icon}</span>}
            <span>{title}</span>
        </NavLink>
    )
}

export { type IMenuItem, SideBarNavItem }
