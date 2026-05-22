import type IUser from "./User";

export default interface IComment {
    id: number,
    ticket: string,
    author: IUser,
    text: string,
    created_at: string,
    comment_type: "comment" | "close_comment" | "cancel_comment" | "resolve_comment" | "reopen_comment" | "assign_comment" | "unassign_comment",
    is_internal?: boolean,
}
