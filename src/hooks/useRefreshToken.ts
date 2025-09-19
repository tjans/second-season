import { authService } from '@/services/authService';

const useRefreshToken = (): (() => Promise<string>) => {
    const refresh = async (): Promise<string> => {
        return await authService.refreshToken();
    }

    return refresh;
}

export default useRefreshToken