import type { FC, ButtonHTMLAttributes, ReactNode } from "react";
import styles from './button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    className?: string;
    svgButton?: boolean;
}

export const Button: FC<ButtonProps> = ({
    children,
    className,
    svgButton = false,
    ...props
}) => {


    return (
        <button
            className={`
                ${styles.button} 
                ${className && styles[className]}
                ${svgButton && styles["svg-button"]}
                `}
            {...props}
        >
            {children && children}
        </button>
    )
}