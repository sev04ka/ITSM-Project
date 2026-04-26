import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './sidebar.module.css'

interface IMenuItem {
    title: string,
    path: string,
    roles?: string[]
}

interface IProps extends IMenuItem { }


const SideBarNavItem: FC<IProps> = ({ title, path }) => {


    return (
        <NavLink
            to={path}
            className={({ isActive }) =>
                isActive ? styles.active : ''
            }
        >
            {title}
        </NavLink>
    )
}

export { type IMenuItem, SideBarNavItem }
