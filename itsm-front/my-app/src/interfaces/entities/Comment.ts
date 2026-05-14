import type IUser from "./User";

export default interface IComment {
    id: number,
    ticket: string,
    author: IUser,
    text: string,
    created_at: string
}
