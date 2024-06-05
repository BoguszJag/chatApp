import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuthContext'
import { useEffect } from 'react';

function ProtectedRoute() {

    const { checkAuth } = useAuth();

    const redirectRoute = '/login';

    useEffect(() => {
        checkAuth();
    }, [checkAuth]) 

    return !checkAuth() ? <Navigate to={redirectRoute}/> : <Outlet/>
    
}

export default ProtectedRoute