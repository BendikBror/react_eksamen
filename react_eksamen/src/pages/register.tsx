import "./css/register.css";
import AddUser from "../components/RegisterUser";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>PadelMania</h1>
        <AddUser />
        <button onClick={handleGoToLogin} className="back-button">
          Tilbake
        </button>
      </div>
    </div>
  );
};

export default Register;
