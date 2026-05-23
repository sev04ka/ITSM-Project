import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './sidebar.module.css'
import { type IMenuLink } from '../../../consts/MenuLinks'


interface IProps extends IMenuLink { }


export const SideBarNavItem: FC<IProps> = ({
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

