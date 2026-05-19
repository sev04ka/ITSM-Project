import type { FC } from "react";
import type IComment from "../../../../../interfaces/entities/Comment";
import styles from './ticketcomment.module.css'
import { formatDateTime } from "../../../../../utils/dateFormatter";

interface TicketCommentProps {
    comment: IComment
}

export const TicketComment: FC<TicketCommentProps> = ({
    comment
}) => {

    const initials = `
    ${comment.author.first_name[0] ? comment.author.first_name[0].toUpperCase() : ''}
    ${comment.author.last_name[0] ? comment.author.last_name[0].toUpperCase() : ''}` || '?'


    return (
        <div className={styles.comment}>
            <div className={styles["comment-header"]}>
                <div className={styles.avatar}>{initials}</div>
                <div className={styles["comment-meta"]}>
                    <span className={styles["comment-author"]}>
                        {comment.author.first_name} {comment.author.last_name}
                    </span>
                    <div className={styles["comment-date-role"]}>
                        <span className={styles["comment-role"]}>{comment.author.role.name}</span>
                        <span className={styles["comment-date"]}>{formatDateTime(comment.created_at)}</span>
                    </div>
                </div>
            </div>
            <div className={styles["comment-text"]}>{comment.text}</div>
        </div>
    )
}