import type { FC, InputHTMLAttributes, ChangeEvent, FocusEvent } from 'react';
import { useController, type Control, type FieldValues, type FieldPath } from 'react-hook-form';

import styles from './input.module.css'


interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onBlur' | 'name'> {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    name: string;
}


export const Input: FC<InputProps> = ({
    value,
    onChange,
    onBlur,
    name,
    type = 'text',
    placeholder,
    autoComplete,
    className,
    ...props
}) => {
    return (
        <input
            className={styles.input}
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            autoComplete={autoComplete}
            {...props}
        />
    )
}