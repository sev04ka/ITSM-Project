import type { FC, ReactNode } from "react";
import styles from './fielderror.module.css'

interface FieldErrorProps {
    children: ReactNode;
}

export const FieldError: FC<FieldErrorProps> = ({
    children,
}) => {
    return (
        <div className={styles["field-error"]}>
            {children}
        </div>
    )
}