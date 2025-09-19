import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/authService';
import { toast } from 'react-toastify';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                await authService.logout();
                navigate('/login');

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An error occurred during logout';
                toast.error(errorMessage);
            }
        }

        load();
    }, []);

    return (
        <div>Logging you out...</div>
    )
}

export default Logout