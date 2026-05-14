import type { FC } from "react"
import { useUserAuthStore } from "../../../store/useUserAuthStore"
import styles from './header.module.css'
import { Button } from "../Button/Button"


export const Header: FC = () => {
    const { currentUser, logout } = useUserAuthStore()

    return (
        <div className={styles.header}>
            <div className={styles["header-title"]}>
                ITSM System
            </div>
            <div className={styles.user}>
                <div className={styles["user-info"]}>
                    <span className={styles["user-name"]}>
                        {currentUser?.first_name} {currentUser?.last_name}
                    </span>
                    <span className={styles["user-role"]}>
                        {currentUser?.role?.name}
                    </span>
                </div>
                <Button
                    onClick={logout}
                    className="logout"
                    svgButton={true}
                >
                </Button>
            </div>
        </div>
    )
}