import type { IUser } from './User'


export interface ITicket {
    id: number,
    ticket_number: string,
    title: string,
    description: string,
    ticket_type: string,
    priority: string,
    status: string,
    requester: IUser,
    created_at: string,
    updated_at: string,
    resolved_at: string,
    closed_at: string,
}