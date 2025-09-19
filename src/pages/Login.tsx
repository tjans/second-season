import { useState } from "react";
import { AxiosError } from "axios";

// foundation
import usePageTitle from '@/hooks/usePageTitle'
import ContentWrapper from "@/components/ContentWrapper";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "@/services/authService";

// forms
import { useForm } from "react-hook-form";

// store
import useAppStore from "@/stores/useAppStore";
import Button from "@/components/Elements/Button";

interface LoginFormData {
    username: string;
    password: string;
}

interface LocationState {
    from?: {
        pathname: string;
    };
}

const Login: React.FC = () => {
    usePageTitle('Login');
    const navigate = useNavigate();
    const location = useLocation();
    const { setAuth } = useAppStore();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        trigger, // Add trigger for manual validation
    } = useForm<LoginFormData>();

    const from = (location.state as LocationState)?.from?.pathname || '/';

    const onSubmit = async (formData: LoginFormData): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await authService.login({ userName: formData.username, password: formData.password });
            setAuth(response.data);
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Login failed:', error);
            
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    alert('Invalid username or password');
                } else {
                    alert('Login failed. Please try again.');
                }
            } else {
                alert('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ContentWrapper title="Login" className="max-w-md mx-auto mt-16">
            <form onSubmit={handleSubmit((data) => {
                if (!isValid) return;
                onSubmit(data);
            })} className="space-y-6">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        {...register("username", { required: "Username is required" })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter your username"
                    />
                    {errors.username && (
                        <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        {...register("password", { required: "Password is required" })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter your password"
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                </div>

                <div className="text-center">
                    <Button
                        type="submit"
                        disabled={isLoading || !isValid}
                        loading={isLoading}
                    >
                        Login
                    </Button>
                </div>
        
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/register')}
                        className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline"
                    >
                        Sign up here
                    </button>
                </p>
            </div>

            {/* Development helper */}
            <div className="mt-8 p-4 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-600 mb-2">Development helpers - Auto-fill and login:</p>
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        type="button"
                        onClick={async () => {
                            setValue('username', 'admin');
                            setValue('password', 'password');
                            await trigger(); // Triggers validation, updates isValid
                            
                            // Call onSubmit directly with the credentials
                            await onSubmit({ username: 'admin', password: 'password' });
                        }}
                        loading={isLoading}
                        disabled={isLoading}
                        variant="outlined"
                        color="secondary"
                    >
                        Log in as Admin
                    </Button>
                    <Button
                        type="button"
                        onClick={async () => {
                            setValue('username', 'member');
                            setValue('password', 'password');
                            await trigger(); // Triggers validation, updates isValid
                            
                            // Call onSubmit directly with the credentials
                            await onSubmit({ username: 'member', password: 'password' });
                        }}
                        loading={isLoading}
                        disabled={isLoading}
                        variant="outlined"
                        color="info"
                    >
                        Log in as Member
                    </Button>
                </div>
            </div>
        </ContentWrapper>
    );
};

export default Login;


