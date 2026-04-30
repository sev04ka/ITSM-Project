import type { FC, ReactNode } from "react";
import styles from './fieldgroup.module.css'

interface FieldGroupProps {
    children: ReactNode;
    button?: "button-center" | "button-right";
    orientation?: "horizontal" | "vertical"
}

export const FieldGroup: FC<FieldGroupProps> = ({
    children,
    button,
    orientation = "vertical"
}) => {
    return (
        <div className={
            `${styles["field-group"]} 
            ${styles[orientation]} 
            ${button ? styles[button] : ""}`
        }>
            {children}
        </div>
    )
}