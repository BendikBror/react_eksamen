import "./css/hjem.css";
import "../assets/2player.jpg";
import { useNavigate } from "react-router-dom";

const hjem = () => {
  const navigate = useNavigate();

  const handleGoToBooking = () => {
    navigate("/booking");
  };

  return (
    <>
      <div className="main-container">
        <div className="bilde-container">
          <div className="bildetekst">
            <h1>Padelmania</h1>
          </div>
        </div>
        <div className="text-container">
          <h1>Velkommen</h1>
          <p>
            Oppdag den ultimate plattformen for å booke din neste padelbane. Hos
            PadelMania tilbyr vi en brukervennlig og moderne tjeneste der du
            enkelt kan sjekke tilgjengelige baner, reservere en tid og invitere
            venner til en spennende padelkamp. Enten du er nybegynner eller en
            erfaren padelspiller, finner du alt du trenger for en førsteklasses
            opplevelse. Book din bane i dag og bli en del av vårt voksende
            fellesskap av padelentusiaster!
          </p>
          <button onClick={handleGoToBooking} className="booking-btn">
            Til Booking
          </button>
        </div>
      </div>
    </>
  );
};

export default hjem;
