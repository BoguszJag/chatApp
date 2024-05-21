import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuthContext'
import { useEffect } from 'react';

function ProtectedRoute() {

    const { auth } = useAuth();
    const { checkAuth } = useAuth();

    const redirectRoute = '/login';

    useEffect(() => {
        checkAuth();
    }, []) 

    return !auth ? <Navigate to={redirectRoute}/> : <Outlet/>
    
}

export default ProtectedRoute