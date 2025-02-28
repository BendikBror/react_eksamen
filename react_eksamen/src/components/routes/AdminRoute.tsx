import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default AdminRoute;
