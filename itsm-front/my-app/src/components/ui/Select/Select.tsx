import { useEffect, useState, useRef, type FC } from 'react'
import styles from './select.module.css'

interface SelectProps {
    initialValue?: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    options: readonly {
        value: string;
        label: string;
    }[];
    id?: string;
    name?: string;
    placeHolder?: string;
}

export const Select: FC<SelectProps> = ({
    initialValue,
    onChange,
    onBlur,
    options,
    placeHolder = '- - - - - -',
    name
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [value, setValue] = useState(initialValue)

    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(option => option.value === value);
    const displayedValue = selectedOption?.label || ''

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                onBlur?.();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, optionValue: string) => {
        e.stopPropagation();
        setValue(optionValue);
        onChange(optionValue);
        setIsOpen(false);
        onBlur?.();
    }

    const handleClear = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.stopPropagation();
        setValue('');
        onChange('');
        onBlur?.();
    }

    return (
        <div
            ref={containerRef}
            className={styles.select}
        >
            <button
                type='button'
                onClick={() => setIsOpen(!isOpen)}
                className={styles['select-button']}
                name={name}
            >
                <span className={styles['select-value']}>{displayedValue ? displayedValue : placeHolder}</span>

                {value && (
                    <span
                        className={styles['clear-btn']}
                        onClick={handleClear}
                    >
                        X
                    </span>
                )}

                {/* <span className={styles['select-arrow']}>
                    {isOpen ? '▲' : '▼'}
                </span> */}
            </button>

            {isOpen && (
                <div className={styles['options-container']}>
                    {options.map((option) => (
                        <span
                            key={option.value}
                            className={styles.option}
                            onClick={(e) => handleSelect(e, option.value)}
                        >
                            {option.label}
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}