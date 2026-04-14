import type { FC } from 'react';
import { Link } from 'react-router-dom';

interface IMenuItem {
    title: string,
    path: string,
    roles?: string[]
}

interface IProps extends IMenuItem { }


const SideBarNavItem: FC<IProps> = ({ title, path }) => {


    return (
        <Link to={path}>
            {title}
        </Link>
    )
}

export { type IMenuItem, SideBarNavItem }
