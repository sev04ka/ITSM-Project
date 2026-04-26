import type { FC, PropsWithChildren } from 'react';
import styles from './fullpagelayout.module.css'
import { Outlet } from 'react-router-dom';


export const FullPageLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className={styles['full-page-layout']}>
            {children}
        </div>
    )
}
