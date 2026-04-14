import type { FC, ReactNode } from "react";

interface FieldDescriptionProps {
    children: ReactNode;
}

export const FieldLabel: FC<FieldDescriptionProps> = ({
    children,
}) => {
    return (
        <p className="field-description">
            {children}
        </p>
    )
}