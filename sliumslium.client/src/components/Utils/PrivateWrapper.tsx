import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface PrivateWrapperProps {
  children: JSX.Element;
  requiredRole?: string;
}

const PrivateWrapper = ({ children, requiredRole }: PrivateWrapperProps) => {
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requiredRole == undefined) {
      if (hasRole("admin") || hasRole("user")) {
        navigate("/unauthorized");
      } else setLoading(false);
    } else {
      if (hasRole(requiredRole)) {
        setLoading(false);
      }
    }
  }, [navigate, requiredRole]);

  if (loading) {
    return null;
  }
  return children;
};

export default PrivateWrapper;
