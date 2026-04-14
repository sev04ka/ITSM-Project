import type { FC, InputHTMLAttributes } from 'react';

interface CheckBoxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'value'> {
    field: {
        value: string | number | undefined;
        onChange: (...args: unknown[]) => void;
        onBlur: () => void;
        name: string;
        ref: (el: HTMLInputElement | null) => void;
    };
    id?: string;
}

export const Input: FC<CheckBoxProps> = ({
    field,
    id,
}) => {
    return (
        <input
            type="checkbox"
            {...field}
            id={id}
        />
    )
}