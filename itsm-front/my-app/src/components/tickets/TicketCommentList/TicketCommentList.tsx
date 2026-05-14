import type { FC } from "react";
import { TicketComment } from "../TicketComment/TicketComment";
import { useEntityList } from "../../../hooks/useEntityList";
import type IComment from "../../../interfaces/entities/Comment";
import styles from './ticketcommentlist.module.css';

interface TicketCommentLisProps {
    ticketId: string | undefined
}
export const TicketCommentList: FC<TicketCommentLisProps> = ({
    ticketId,
}) => {
    const { data, loading } = useEntityList<IComment>(`/comments/for/${ticketId}`);

    if (loading) return <div>Загрузка...</div>

    return (
        <div className={styles.section}>
            <div className={styles["section-header"]}>
                <h2 className={styles["section-title"]}>Комментарии</h2>
                {!loading && data.length > 0 && (
                    <span className={styles["comment-count"]}>{data.length}</span>
                )}
            </div>

            {loading && <div className={styles.loading}>Загрузка комментариев...</div>}

            {!loading && data.length === 0 && (
                <div className={styles.empty}>Пока нет комментариев</div>
            )}

            {!loading && data.length > 0 && (
                <div className={styles.list}>
                    {data.map((comment) => (
                        <TicketComment comment={comment} key={comment.id} />
                    ))}
                </div>
            )}
        </div>
    )
}