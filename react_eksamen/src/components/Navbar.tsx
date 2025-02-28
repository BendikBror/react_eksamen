import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../pages/css/Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="navbar">
      <Link className="navbar__logo" to="/">
        <img src={logo} alt="Logo" />
      </Link>
      <ul className="navbar__menu">
        <li>
          <Link to="/">Hjem</Link>
        </li>
        <li>
          <Link to="/booking">Booking</Link>
        </li>
        {user.role === "user" && (
          <li>
            <Link to="/minside">Min Side</Link>
          </li>
        )}
        {user.role === "admin" && (
          <li>
            <Link to="/admin">Admin Panel</Link>
          </li>
        )}
        <li>
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
