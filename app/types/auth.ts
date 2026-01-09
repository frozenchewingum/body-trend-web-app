export interface LoginCredential {
    email: string;
    password: string;
}

export interface SignupCredential {
    email: string;
    password: string;
}


export interface UserProfile {
    birth_date: string;
    created_at: string | null;
    first_name: string;
    gender: string;
    height_cm: number;
    id: string;
    last_name: string;
}