import type { FC, InputHTMLAttributes } from 'react';
import './input.css'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'value'> {
    field: {
        value: string | number | undefined;
        onChange: (...args: unknown[]) => void;
        onBlur: () => void;
        name: string;
        ref: (el: HTMLInputElement | null) => void;
    };
    id?: string;
    placeholder?: string;
    autoComplete?: string;
}

export const Input: FC<InputProps> = ({
    field,
    id,
    placeholder,
    autoComplete
}) => {
    return (
        <input className='input'
            {...field}
            id={id}
            placeholder={placeholder}
            autoComplete={autoComplete}
        />
    )
}