import type { FC } from "react"
import { useUserAuthStore } from "../../../store/useUserAuthStore"
import styles from './header.module.css'

export const Header: FC = () => {
    const { currentUser, logout } = useUserAuthStore()

    return (
        <div className={styles.header}>
            <div className={styles.user}>
                <div>
                    {`${currentUser?.first_name} ${currentUser?.last_name}`}
                </div>
                <div className="">
                    <button onClick={logout}>logout</button>
                </div>
            </div>
        </div>
    )
}