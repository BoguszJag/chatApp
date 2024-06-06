import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuthContext'
import { useEffect } from 'react';

function ProtectedRoute() {

    const { auth, checkAuth } = useAuth();

    const redirectRoute = '/login';

    useEffect(() => {
        checkAuth();
    }, []);

    return !localStorage.getItem('user') ? <Navigate to={redirectRoute}/> : <Outlet/>
    
}

export default ProtectedRoute