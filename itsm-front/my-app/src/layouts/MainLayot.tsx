import type { FC, PropsWithChildren } from 'react';
import SideBar from '../components/ui/SideBar/SideBar'
import { Header } from '../components/ui/Header/Header';
import './mainLayout.css'

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className='main-layout'>
            <Header />
            <div className='main-layout__body'>
                <SideBar />
                <div className='dashboard-content'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default MainLayout