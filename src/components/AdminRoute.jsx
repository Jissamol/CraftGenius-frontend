import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    const isSuperuser = localStorage.getItem('is_superuser') === 'true';

    if (!token || (role !== 'ADMIN' && !isSuperuser)) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default AdminRoute;
