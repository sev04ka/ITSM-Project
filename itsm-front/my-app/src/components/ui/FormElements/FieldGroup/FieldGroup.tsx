import type { FC, ReactNode } from "react";
import styles from './fieldgroup.module.css'

interface FieldGroupProps {
    children: ReactNode;
    className?: "button" | "";
}

export const FieldGroup: FC<FieldGroupProps> = ({
    children,
    className
}) => {
    return (
        <div className={
            `${styles["field-group"]} 
            ${className ? styles[className] : ""}`
        }>
            {children}
        </div>
    )
}