import { Navigate } from 'react-router-dom';

function HandicrafterRoute({ children }) {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');

    if (!token || role !== 'HANDICRAFTER') {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default HandicrafterRoute;
