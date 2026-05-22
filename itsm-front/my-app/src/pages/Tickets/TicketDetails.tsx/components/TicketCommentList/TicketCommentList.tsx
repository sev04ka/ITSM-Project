import { type FC, useRef, useEffect } from "react";
import { TicketComment } from "../TicketComment/TicketComment";
import { useEntityList } from "../../../../../hooks/useEntityList";
import type IComment from "../../../../../interfaces/entities/Comment";
import styles from './ticketcommentlist.module.css';

interface TicketCommentListProps {
    ticketId: string
}

export const TicketCommentList: FC<TicketCommentListProps> = ({
    ticketId,
}) => {
    const { data, loading } = useEntityList<IComment>(`/comments/for/${ticketId}`);
    const chatWindowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!loading && data.length > 0 && chatWindowRef.current) {
            requestAnimationFrame(() => {
                if (chatWindowRef.current) {
                    chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
                }
            });
        }
    }, [loading, data]);

    if (loading) return <div className={styles.loading}>Загрузка комментариев...</div>

    return (
        <>
            {!loading && data.length === 0 && (
                <div className={styles.empty}>Пока нет комментариев</div>
            )}

            {!loading && data.length > 0 && (
                <div className={styles["chat-window"]} ref={chatWindowRef}>
                    {data.map((comment) => (
                        <TicketComment comment={comment} key={comment.id} />
                    ))}
                </div>
            )}
        </>
    )
}
