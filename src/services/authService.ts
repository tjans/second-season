import { AxiosResponse } from 'axios';
import { appAxios } from '@/api/axios';
import useAppStore, { AuthData } from '@/stores/useAppStore';

interface LoginCredentials {
    userName: string;
    password: string;
}

/**
 * Centralized auth service to handle all authentication operations
 * and ensure consistent auth data management across the app
 */
class AuthService {
    private store: ReturnType<typeof useAppStore.getState>;

    constructor() {
        this.store = useAppStore.getState();
    }

    /**
     * Sets auth data in the store from API response
     */
    setAuthFromResponse(authResponse: AxiosResponse<AuthData>): void {
        this.store.setAuth({
            userName: authResponse?.data?.userName,
            userId: authResponse?.data?.userId,
            accessToken: authResponse?.data?.accessToken,
            roles: authResponse?.data?.roles
        });
    }

    /**
     * Clears auth data (logout)
     */
    clearAuth(): void {
        this.store.setAuth(null);
    }

    /**
     * Invalidates just the access token (for testing purposes)
     */
    invalidateAccessToken(): void {
        const currentAuth = this.store.auth;
        if (currentAuth) {
            this.store.setAuth({
                ...currentAuth,
                accessToken: '',
            });
        }
    }

    /**
     * Performs login and sets auth data
     */
    async login(credentials: LoginCredentials): Promise<AxiosResponse<AuthData>> {
        const response = await appAxios.post<AuthData>('/auth/login', JSON.stringify(credentials));
        this.setAuthFromResponse(response);
        return response;
    }

    /**
     * Performs token refresh and sets auth data
     */
    async refreshToken(): Promise<string> {
        const response = await appAxios.post<AuthData>('/auth/refresh', {
            withCredentials: true
        });
        this.setAuthFromResponse(response);
        return response.data.accessToken;
    }

    /**
     * Performs logout API call and clears auth data
     */
    async logout(): Promise<void> {
        await appAxios.post('/auth/logout');
        this.clearAuth();
    }

    /**
     * Bootstrap auth check - attempts refresh and handles result
     */
    async bootstrap(): Promise<boolean> {
        try {
            const response = await appAxios.post<AuthData>('/auth/refresh');
            this.setAuthFromResponse(response);
            return true;
        } catch {
            this.clearAuth();
            return false;
        }
    }
}

// Export a singleton instance
export const authService = new AuthService();

// Export individual functions for easier importing
export const { login, refreshToken, logout, bootstrap, clearAuth, invalidateAccessToken } = authService;
