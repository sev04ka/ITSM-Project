import type { FC, PropsWithChildren } from 'react';
import SideBar from '../components/ui/SideBar/SideBar'
import { Header } from '../components/ui/Header/Header';
import styles from './mainLayout.module.css'

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className={styles['main-layout']}>

            <div className={styles.container}>
                <SideBar />
                <div className={styles.body}>
                    <Header />
                    <div className={styles.content}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainLayout