import { useEffect, useState, useRef, useCallback, type FC } from 'react'
import { createPortal } from 'react-dom'
import styles from './select.module.css'

interface SelectProps {
    value: string;
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

/** 
 * Значение должно передаваться из состояния родительского компонента или от состояния формы
 * 
 * @remarks
 * Используется в формах (с react-hook-form) и самостоятельно (фильтры).
*/
export const Select: FC<SelectProps> = ({
    value,
    onChange,
    onBlur,
    options,
    placeHolder = '- - - - - -',
    name
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState<{
        top: number;
        left: number;
        width: number;
        openUp: boolean;
    } | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(option => option.value === value);
    const displayedValue = selectedOption?.label || ''

    const updatePosition = useCallback(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const estimatedHeight = Math.min(options.length * 36 + 16, 320);
        const openUp = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;

        setDropdownStyle({
            top: openUp ? rect.top - estimatedHeight : rect.bottom,
            left: rect.left,
            width: rect.width,
            openUp,
        });
    }, [options.length]);

    const open = useCallback(() => {
        updatePosition();
        setIsOpen(true);
    }, [updatePosition]);

    const close = useCallback(() => {
        setIsOpen(false);
        setDropdownStyle(null);
        onBlur?.();
    }, [onBlur]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                    close();
                }
            }
        };

        if (isOpen) {
            updatePosition();
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, close, updatePosition]);

    const handleSelect = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, optionValue: string) => {
        e.stopPropagation();
        onChange(optionValue);
        close();
    }

    const handleClear = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.stopPropagation();
        onChange('');
        close();
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            close();
        }
    };

    return (
        <div
            ref={containerRef}
            className={styles.select}
        >
            <button
                type='button'
                onClick={() => isOpen ? close() : open()}
                className={styles['select-button']}
                name={name}
            >
                <span className={styles['select-value']}>{displayedValue ? displayedValue : placeHolder}</span>

                <span className={`${styles.arrow} ${isOpen ? styles['arrow-up'] : ''}`}>
                    ▼
                </span>

                {value && (
                    <span
                        className={styles['clear-btn']}
                        onClick={handleClear}
                    >
                        X
                    </span>
                )}
            </button>

            {isOpen && dropdownStyle && createPortal(
                <div
                    ref={optionsRef}
                    className={`${styles['options-container']} ${dropdownStyle.openUp ? styles['options-up'] : ''}`}
                    style={{
                        position: 'fixed',
                        top: dropdownStyle.top,
                        left: dropdownStyle.left,
                        width: dropdownStyle.width,
                    }}
                    onKeyDown={handleKeyDown}
                >
                    {options.length === 0 && (
                        <span className={styles['no-options']}>Нет вариантов</span>
                    )}
                    {options.map((option) => (
                        <span
                            key={option.value}
                            className={`${styles.option} ${option.value === value ? styles['option-selected'] : ''}`}
                            onClick={(e) => handleSelect(e, option.value)}
                        >
                            {option.label}
                        </span>
                    ))}
                </div>,
                document.body
            )}
        </div>
    )
}