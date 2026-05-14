import type { FC, ReactNode } from "react";
import styles from './fielddescription.module.css'

interface FieldDescriptionProps {
    children: ReactNode;
}

export const FieldLabel: FC<FieldDescriptionProps> = ({
    children,
}) => {
    return (
        <p className={styles["field-description"]}>
            {children}
        </p>
    )
}