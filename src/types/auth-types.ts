export interface AuthResult {
    success: boolean;
    userEmail?: string;
    userName?: string;
    error?: string;
    errorCode?: string;
}

export interface CalendarInfo {
    id: string;
    name: string;
    description?: string;
    isPrimary: boolean;
    accessRole: string;
    backgroundColor?: string;
}

export interface CalendarListResult {
    success: boolean;
    calendars?: CalendarInfo[];
    error?: string;
    errorCode?: string;
}

export interface UserInfo {
    email: string;
    name: string;
    isAuthenticated: boolean;
}

export interface AuthStatusResult {
    isAuthenticated: boolean;
    userEmail?: string;
    userName?: string;
    error?: string;
}