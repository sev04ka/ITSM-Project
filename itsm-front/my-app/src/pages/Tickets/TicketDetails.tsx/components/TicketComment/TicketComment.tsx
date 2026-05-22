import type { FC } from "react";
import type IComment from "../../../../../interfaces/entities/Comment";
import styles from './ticketcomment.module.css'
import { formatDateTime } from "../../../../../utils/dateFormatter";
import { useUserAuthStore } from "../../../../../store/useUserAuthStore";

interface TicketCommentProps {
    comment: IComment
}

export const TicketComment: FC<TicketCommentProps> = ({
    comment
}) => {
    const { currentUser } = useUserAuthStore();
    const isOwn = currentUser?.id === comment.author.id;
    const isAction = comment.comment_type != 'comment';
    const isInternal = comment.is_internal === true;

    if (isAction) {
        return (
            <div className={`${styles.comment} ${styles["comment-system"]}`}>
                <div className={styles["system-msg"]}>
                    <span className={styles["system-dot"]} />
                    <span>{comment.text}</span>
                    <span className={styles["system-dot"]} />
                </div>
            </div>
        )
    }

    const bubbleClass = [
        styles.bubble,
        isOwn ? styles["bubble-own"] : '',
        isInternal ? styles["bubble-internal"] : '',
    ].filter(Boolean).join(' ');

    return (
        <div className={`${styles.comment} ${isOwn ? styles["comment-own"] : styles["comment-other"]}`}>
            <div className={bubbleClass}>
                <div className={`${styles.header} ${isOwn ? styles["header-right"] : styles["header-left"]}`}>
                    {!isOwn &&
                        <>
                            <span className={styles.author}>
                                {comment.author.first_name} {comment.author.last_name}
                            </span>
                            <span className={styles["role-badge"]}>{comment.author.role.name}</span>
                        </>
                    }
                    {isInternal && <span className={styles["internal-badge"]}>Только персонал</span>}
                </div>
                <div className={styles.text}>{comment.text}</div>
            </div>
            <div className={`${styles.date} ${isOwn ? styles["date-right"] : styles["date-left"]}`}>
                {formatDateTime(comment.created_at)}
            </div>
        </div>
    )
}
