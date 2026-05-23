import type { FC } from "react";
import { Link } from "react-router-dom";
import { useUserAuthStore } from "../../store/useUserAuthStore";
import { useRole } from "../../hooks/useRole";
import styles from './home.module.css'
import { links } from "../../consts/MenuLinks";
import { roleLabels } from "../../consts/Labels/roleLabels";


const iconClassMap: Record<string, string> = {
    blue: styles["card-icon-blue"],
    yellow: styles["card-icon-yellow"],
    green: styles["card-icon-green"],
    red: styles["card-icon-red"],
    purple: styles["card-icon-purple"],
    gray: styles["card-icon-gray"],
};

export const Home: FC = () => {
    const { currentUser } = useUserAuthStore();
    const { hasAccess } = useRole();

    if (!currentUser) return null;


    const visibleLinks = links.filter((l) => hasAccess(l.roles));

    return (
        <div className={styles.page}>
            <div className={styles["welcome-card"]}>
                <div className={styles["welcome-greeting"]}>
                    {currentUser.first_name} {currentUser.last_name}
                </div>
                <div className={styles["welcome-sub"]}>
                    {roleLabels[currentUser.role.name]} &middot; {currentUser.organization.name}
                </div>
            </div>

            <div className={styles.grid}>
                {visibleLinks.map((link) => (
                    <Link key={link.path} to={link.path} className={styles.card}>
                        <div className={`${styles["card-icon"]} ${iconClassMap[link.iconColor] || ''}`}>
                            {link.icon}
                        </div>
                        <div className={styles["card-title"]}>{link.title}</div>
                        <div className={styles["card-desc"]}>{link.desc}</div>
                    </Link>
                ))}
            </div>
        </div>
    )
}