import React, { useEffect, useRef } from 'react';
import useAppStore from '@/stores/useAppStore';
import { setRefreshTokenFunction } from '@/api/axios';
import { authService } from '@/services/authService';
import useRefreshToken from '@/hooks/useRefreshToken';

const AppBootstrap: React.FC = () => {
    const hasRunRef = useRef<boolean>(false);
    const appStore = useAppStore();
    const refresh = useRefreshToken();

    useEffect(() => {
        if (hasRunRef.current) return;
        hasRunRef.current = true;

        // Set up the refresh function for the axios interceptor
        setRefreshTokenFunction(refresh);

        const bootstrap = async (): Promise<void> => {
            try {
                await authService.bootstrap();
            } finally {
                appStore.setHasAttemptedAuthRefresh(true);
            }
        };

        bootstrap();
    }, [appStore, refresh]);

    return null;
};

export default AppBootstrap;
