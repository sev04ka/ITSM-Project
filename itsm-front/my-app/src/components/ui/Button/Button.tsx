import type { FC, ButtonHTMLAttributes, ReactNode } from "react";
import styles from './button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export const Button: FC<ButtonProps> = ({
    children,
    ...props
}) => {
    return (
        <button
            className={styles.button}
            {...props}
        >
            {children}
        </button>
    )
}