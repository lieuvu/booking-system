export interface User {
    id: number;
    username: string;
    hashed_password: string;
    salt: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
}
