import React from 'react';
import { appAxios } from '@/api/axios';
import useAppStore from '@/stores/useAppStore';
import useRefreshToken from '@/hooks/useRefreshToken';
import { authService } from '@/services/authService';
import InlineSpinner from "@/components/InlineSpinner";
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import Button from '../Elements/Button';
import testService, {TestUser} from '@/services/testService';
import {useQuery, useQueryClient} from '@tanstack/react-query'

// https://www.youtube.com/watch?v=nI8PYZNFtac
const AxiosTester: React.FC = () => {
    const refresh = useRefreshToken();
    const isLoading = useAppStore((s) => s.isApiLoading());
    const queryClient = useQueryClient();
    
    const testUsersResult = useQuery<TestUser[], AxiosError>({
        queryKey: ['testUsers2'],
        queryFn: testService.getTestUsers,
        staleTime: 1000 * 60, // cache for 1 minute
    });

    const handleFetchTestUsers = async () => {
        await queryClient.fetchQuery({
            queryKey: ['testUsers2'],
            queryFn: testService.getTestUsers,
            staleTime: 1000 * 60, // cache for 1 minute
        });
    };

    const fetchPublicData = async (): Promise<void> => {
        try {
            const publicResponse = await appAxios.get('/sample');
            toast.success(publicResponse.data.message);
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            toast.error(axiosError.response?.data?.message || axiosError.message);
        }
    }

    const fetchProtectedData = async (): Promise<void> => {

        try {
            const protectedResponse = await appAxios.get('/sample/protected');
            toast.success(protectedResponse.data.message);
        } catch (error) {
            const axiosError = error as AxiosError;
            toast.error(axiosError.message)

        }
    }

    const killAccessToken = async (): Promise<void> => {
        authService.invalidateAccessToken();
        toast.warning("Access token has been invalidated!");
    }

    // Right now the refresh is correctly populating the data in the store.  However,
    // when the axios interceptor fails and does its own refresh, it doesn't rehydrate
    // the store.
    const fetchRefresh = async (): Promise<void> => {
        try {
            await refresh();
            toast.success("Refreshed your accessToken successfully!")
        } catch (error) {
            const axiosError = error as AxiosError;
            toast.error(axiosError.message)
        }
    }

    return (
        <>
            <h1 className="text-2xl font-bold mb-4">
                Axios Tester
                {isLoading && <InlineSpinner />}
            </h1>

            <div className="my-4">
                <Button 
                    onClick={handleFetchTestUsers} 
                    overrideClasses="bg-pink-500 text-white"
                    loading={testUsersResult.isFetching}>
                        Fetch Test Users
                </Button>

                {testUsersResult?.data && testUsersResult.data.map(user => (
                    <div key={user.id}>{user.name}</div>
                ))}
            </div>

            <div className="my-4">
                <Button onClick={fetchPublicData} color="success">Fetch Public Data</Button>
            </div>

            <div className="my-8">
                <Button onClick={fetchProtectedData} color="warning">Fetch Protected Data</Button>
            </div>

            <div className="my-8">
                <Button onClick={fetchRefresh} color="info">Refresh</Button>
            </div>

            <div className="my-8">
                <Button onClick={killAccessToken} color="error">Kill Access Token</Button>
            </div>
        </>
    )
}

export default AxiosTester