import {UserLimit} from "./user-limit";

export enum PayloadType {
    USER_LIMIT_CREATED = 'USER_LIMIT_CREATED',
    USER_LIMIT_PROGRESS_CHANGED = 'USER_LIMIT_PROGRESS_CHANGED',
    USER_LIMIT_RESET = 'USER_LIMIT_RESET',
    UNKNOWN = 'UNKNOWN'
}

export interface EventPayload {
        aggregateId: string;
        context: {
            correlationId: string;
        }
        createdAt: number;
        eventId: string;
        payload: UserLimit;
        sequenceNumber: number;
        source: string;
        type: PayloadType;
}