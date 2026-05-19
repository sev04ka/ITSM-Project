import { type FC, type ReactNode } from "react";
import styles from "./formcard.module.css";

interface FormCardProps {
    title: string;
    children: ReactNode;
}

export const FormCard: FC<FormCardProps> = ({
    title,
    children
}) => {
    return (
        <div className={styles.page}>
            <div className={styles["form-card"]}>
                <h1>{title}</h1>
                {children}
            </div>
        </div>
    )
}