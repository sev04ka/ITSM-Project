import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import MainLayout from '../layouts/MainLayot';

const DashBoard: FC = () => {

    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    )
}

export default DashBoard
