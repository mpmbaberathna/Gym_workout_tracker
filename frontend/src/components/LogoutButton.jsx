import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/users/logout');
    } catch (e) {}
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="px-3 py-1 rounded bg-rose-500 text-white">Logout</button>
  );
}

export default LogoutButton;
