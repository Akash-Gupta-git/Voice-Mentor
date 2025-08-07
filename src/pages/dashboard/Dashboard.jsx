import { logoutUser } from "../../../Backend/auth/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="container text-center py-5">
      <h1 className="mb-3">Welcome to Your Dashboard</h1>
      <p className="lead">This is your protected dashboard page.</p>
      <Button variant="danger" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Dashboard;
