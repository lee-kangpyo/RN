import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const isLogin = !!localStorage.getItem("auth");
    return isLogin ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;