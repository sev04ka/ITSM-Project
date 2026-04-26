import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout/MainLayout';


export const Requests: FC = () => {
    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    )
}