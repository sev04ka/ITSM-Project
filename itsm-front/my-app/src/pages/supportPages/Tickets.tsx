import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayot';


export const Tickets: FC = () => {
    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    )
}