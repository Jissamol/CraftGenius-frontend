import { Navigate } from 'react-router-dom';

function CustomerRoute({ children }) {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');

    if (!token || role !== 'CUSTOMER') {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default CustomerRoute;
