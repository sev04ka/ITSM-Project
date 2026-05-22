import type { TextareaHTMLAttributes } from 'react';
import { useController, type Control, type FieldValues, type FieldPath } from 'react-hook-form';
import { FieldLabel } from '../FieldLabel/FieldLabel';
import { FieldError } from '../FieldError/FieldError';
import styles from './textarea.module.css'

interface TextAreaProps<T extends FieldValues = FieldValues>
    extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'type' | 'value' | 'name'> {
    name: FieldPath<T>;
    control: Control<T>;
    rules?: any;
    placeholder?: string;
    autoComplete?: string;
    label?: string;
}

export const TextArea = <T extends FieldValues>({
    name,
    control,
    rules,
    placeholder,
    autoComplete,
    label,
}: TextAreaProps<T>) => {
    const { field, fieldState } = useController({
        name,
        control,
        rules
    });
    return (
        <div className={styles["textarea-wrapper"]}>
            {label &&
                <FieldLabel htmlFor={name}>{label}</FieldLabel>
            }
            <textarea className={styles.textarea}
                {...field}
                id={name}
                placeholder={placeholder}
                autoComplete={autoComplete}
                onChange={(e) => field.onChange(e.target.value)}
            />
            {fieldState.invalid && (
                <FieldError>{[fieldState.error?.message]}</FieldError>
            )}
        </div>
    )
}