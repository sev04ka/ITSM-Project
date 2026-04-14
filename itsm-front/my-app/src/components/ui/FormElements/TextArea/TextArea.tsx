import type { FC, TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'onBlur' | 'value'> {
    field: {
        value: string | number | undefined;
        onChange: (...args: unknown[]) => void;
        onBlur: () => void;
        name: string;
        ref: (el: HTMLTextAreaElement | null) => void;
    };
    id?: string;
    placeholder?: string;
    autoComplete?: string;
}

export const TextArea: FC<TextAreaProps> = ({
    field,
    id,
    placeholder,
    autoComplete,
}) => {
    return (
        <textarea
            {...field}
            id={id}
            placeholder={placeholder}
            autoComplete={autoComplete}
        />
    )
}