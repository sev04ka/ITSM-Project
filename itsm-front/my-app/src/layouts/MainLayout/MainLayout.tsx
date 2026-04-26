import type { FC } from 'react';
import SideBar from '../../components/ui/SideBar/SideBar'
import { Header } from '../../components/ui/Header/Header';
import styles from './mainLayout.module.css'
import { Outlet } from 'react-router-dom';

export const MainLayout: FC = () => {
    return (
        <div className={styles['main-layout']}>

            <div className={styles.container}>
                <SideBar />
                <div className={styles.body}>
                    <Header />
                    <div className={styles.content}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}
