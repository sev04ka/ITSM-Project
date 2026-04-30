import type { FC, ReactNode } from "react";
import styles from './field.module.css'

interface FieldProps {
    children: ReactNode;
    className?: string;
}

export const Field: FC<FieldProps> = ({
    children,
    className
}) => {
    return (
        <div className={`${styles.field} ${className && styles[className]}`}>
            {children}
        </div>
    )
}