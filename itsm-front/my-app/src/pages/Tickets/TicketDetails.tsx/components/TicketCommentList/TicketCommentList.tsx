import { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { TicketComment } from "../TicketComment/TicketComment";
import { useEntityList } from "../../../../../hooks/useEntityList";
import type IComment from "../../../../../interfaces/entities/Comment";
import styles from './ticketcommentlist.module.css';

interface TicketCommentListProps {
    ticketId: string,
}

export interface TicketCommentListRef {
    refresh: () => void;
}

export const TicketCommentList = forwardRef<TicketCommentListRef, TicketCommentListProps>(({
    ticketId,
}, ref) => {
    const { data, loading, refetch } = useEntityList<IComment>(`/comments/for/${ticketId}`);
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const shouldScrollToBottom = useRef(false);

    useImperativeHandle(ref, () => ({
        refresh: () => {
            shouldScrollToBottom.current = true;
            refetch();
        }
    }));

    useEffect(() => {
        if (!loading && data.length > 0 && chatWindowRef.current && shouldScrollToBottom.current) {
            requestAnimationFrame(() => {
                if (chatWindowRef.current) {
                    chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
                }
                shouldScrollToBottom.current = false;
            });
        }
    }, [loading, data.length]);


    return (
        <>
            {loading && data.length === 0 && (
                <div className={styles.loading}>Загрузка комментариев...</div>
            )}

            {!loading && data.length === 0 && (
                <div className={styles.empty}>Пока нет комментариев</div>
            )}

            {data.length > 0 && (
                <div className={styles["chat-window"]} ref={chatWindowRef}>
                    {data.map((comment) => (
                        <TicketComment comment={comment} key={comment.id} />
                    ))}
                </div>
            )}
        </>
    )
});
