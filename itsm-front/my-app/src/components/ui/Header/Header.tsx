import type { FC } from "react"
import { useUserAuthStore } from "../../../store/useUserAuthStore"
import styles from './header.module.css'
import { Button } from "../Button/Button"


export const Header: FC = () => {
    const { currentUser, logout } = useUserAuthStore()

    return (
        <div className={styles.header}>
            <div className={styles.user}>
                <div>
                    <span>
                        {`${currentUser?.first_name} ${currentUser?.last_name}`}
                    </span>
                </div>
                <div className="">
                    <Button
                        onClick={logout}
                        className="logout"
                        svgButton={true}
                    >
                    </Button>
                </div>
            </div>
        </div>
    )
}