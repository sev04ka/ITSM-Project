import type { IUser } from "./User";

export interface IComment {
    id: number,
    ticket: string,
    author: IUser,
    text: string,
    created_at: string
}
