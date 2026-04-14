import type { FC } from "react"
import { useUserAuthStore } from "../../../store/useUserAuthStore"
import './header.css'

export const Header: FC = () => {
    const { currentUser, logout } = useUserAuthStore()

    return (
        <div className="header">
            <div className="org-label">
                <h2>
                    {currentUser?.organization.name}
                </h2>
            </div>
            <div className="user">
                <div>
                    {`${currentUser?.first_name} ${currentUser?.last_name}`}
                </div>
                <div className="logout">
                    <button onClick={logout}>logout</button>
                </div>
            </div>
        </div>
    )
}