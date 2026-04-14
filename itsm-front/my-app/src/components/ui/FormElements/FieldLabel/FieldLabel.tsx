import type { FC, ReactNode } from "react";
import './fieldlabel.css'

interface FieldLabelProps {
    children: ReactNode;
    htmlFor: string;
}

export const FieldLabel: FC<FieldLabelProps> = ({
    children,
    htmlFor
}) => {
    return (
        <label htmlFor={htmlFor} className="field-label">
            {children}
        </label>
    )
}