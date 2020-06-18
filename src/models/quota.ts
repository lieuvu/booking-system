export interface Quota {
    id: number;
    user_id: number;
    quota: number;
    valid_from: string;
    valid_until: string;
}
