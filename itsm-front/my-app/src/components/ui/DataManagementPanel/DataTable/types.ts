import type React from "react";

export interface Column<T> {
    key: keyof T | string;
    title: string;
    sortable?: boolean;
    template?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    error?: string | null;
    emptyMessage?: string;
    deleteHandler: (id: number) => void;
}