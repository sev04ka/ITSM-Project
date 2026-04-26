import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout/MainLayout';


export const Tickets: FC = () => {
    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    )
}