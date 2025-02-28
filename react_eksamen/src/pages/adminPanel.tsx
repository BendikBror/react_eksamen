import AddUser from "../components/RegisterUser";
import GetUser from "../components/GetUser";
import GetUsers from "../components/GetUsers";
import GetBookings from "../components/GetBookings";
import "./css/adminPanel.css";
import Booking from "./booking";

const AdminPanel = () => {
  return (
    <>
      <h1>Adminpanel</h1>
      <div className="main-container">
        <h2>Opprett bruker</h2>
        <AddUser />
        <GetUsers />
        <GetUser />
        <h2>Bookingadministrasjon</h2>
        <Booking />
        <GetBookings />
      </div>
    </>
  );
};

export default AdminPanel;