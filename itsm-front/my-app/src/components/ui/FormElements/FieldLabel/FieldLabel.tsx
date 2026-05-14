import type { FC, ReactNode } from "react";
import styles from './fieldlabel.module.css'

interface FieldLabelProps {
    children: ReactNode;
    htmlFor: string;
}

export const FieldLabel: FC<FieldLabelProps> = ({
    children,
    htmlFor
}) => {
    return (
        <label htmlFor={htmlFor} className={styles["field-label"]}>
            {children}
        </label>
    )
}