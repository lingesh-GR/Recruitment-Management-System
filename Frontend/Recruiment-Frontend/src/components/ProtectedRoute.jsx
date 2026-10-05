import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function ProtectedRoute({children,allowRoles})
{
const  { user } = useAuth()
if(!user)
    return <Navigate to = "/login"></Navigate>
if(allowRoles && !allowRoles.includes(user.role))
    return <Navigate to = "/login"/>
    return children;
}
export default ProtectedRoute