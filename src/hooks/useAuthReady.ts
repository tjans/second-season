import useAppStore from '@/stores/useAppStore';
import type { AuthData } from '@/stores/useAppStore';

interface UseAuthReadyReturn {
    isReady: boolean;
    isAuthenticated: string | undefined;
    user: AuthData | null;
}

export default function useAuthReady(): UseAuthReadyReturn {
    const appStore = useAppStore();

    return {
        isReady: appStore.hasAttemptedAuthRefresh,           // ✅ app has checked auth state
        isAuthenticated: appStore.auth?.accessToken,   // ✅ valid session in memory
        user: appStore.auth,                             // 👤 current user info (can be null)
    };
}
