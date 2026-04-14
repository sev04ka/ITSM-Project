import { format, parseISO, isValid } from 'date-fns';

export const formatDateTime = (date: Date | string | null): string => {
    if (!date) return '—';
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsed)) return '—';
    return format(parsed, 'y.MM.dd HH:mm ');
};