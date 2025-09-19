import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAppStore from "@/stores/useAppStore";
import Unauthorized from "@/pages/Unauthorized";

interface RequireAuthProps {
    allowedRoles?: string[];
}

const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles = [] }) => {
    const location = useLocation();
    const appStore = useAppStore();

    const requiresRoles = allowedRoles.length > 0;

    return appStore.auth?.userName
        ? (!requiresRoles || appStore.auth?.roles?.some(role => {
            const roleName = typeof role === 'string' ? role : role.Name;
            return allowedRoles?.includes(roleName);
          }))
            ? <Outlet />
            : <Unauthorized />
        : <Navigate to="/login" state={{ from: location }} replace />;
}

export default RequireAuth;