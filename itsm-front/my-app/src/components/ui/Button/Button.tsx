import type { FC, ButtonHTMLAttributes, ReactNode } from "react";
import styles from './button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    className?: string;
    svgButton?: boolean;
    size?: "sm" | "m" | "lg" | "xl"
}

export const Button: FC<ButtonProps> = ({
    children,
    className,
    svgButton = false,
    size,
    ...props
}) => {


    return (
        <button
            className={`
                ${styles.button} 
                ${className && styles[className]}
                ${svgButton && styles["svg-button"]}
                ${size && styles[size]}
                `}
            {...props}
        >
            {children && children}
        </button>
    )
}