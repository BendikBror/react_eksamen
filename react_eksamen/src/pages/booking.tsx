import { useState, useEffect } from "react";
import { createBooking, getBookings } from "../api/bookings";
import { useAuth } from "../auth/AuthContext";
import type { Booking, NewBooking } from "../types/types";
import "./css/booking.css";

const booking = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [court, setCourt] = useState<string>("");
  const [players, setPlayers] = useState<number>(2);
  const [time, setTime] = useState<string | null>(null);
  const [medPlayers, setMedPlayers] = useState<string[]>([""]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookings(user || null);
        setBookings(data);
      } catch (err) {
        setError("Kunne ikke hente bookinger.");
      }
    };
    fetchBookings();
  }, [user, selectedDate]);

  const times = Array.from({ length: 12 }, (_, i) => {
    const hour = 9 + i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const handleDateChange = (direction: "prev" | "next") => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + (direction === "next" ? 1 : -1));
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("Du må være logget inn for å booke.");
      return;
    }

    if (!court || !time) {
      setError("Vennligst velg bane og tidspunkt.");
      return;
    }

    const isBooked = bookings.some(
      (b) => b.court === court && b.date === selectedDate && b.time === time
    );
    if (isBooked) {
      setError("Denne tiden er allerede booket for valgt bane.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const bookingData: NewBooking = {
      player: user._id,
      court,
      players,
      date: selectedDate,
      time,
      medPlayers: medPlayers.filter((p) => p.trim() !== "") || [],
    };

    try {
      const newBooking = await createBooking(bookingData);
      setBookings((prev) => [...prev, newBooking]);
      setSuccess("Booking opprettet!");
      setCourt("");
      setTime(null);
      setMedPlayers([""]);
    } catch (err) {
      setError("Kunne ikke opprette booking. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  const handleTimeClick = (selectedTime: string) => {
    setTime(selectedTime);
  };

  const isTimeBooked = (t: string) => {
    return bookings.some(
      (b) => b.court === court && b.date === selectedDate && b.time === t
    );
  };

  const handleMedPlayerChange = (index: number, value: string) => {
    const newMedPlayers = [...medPlayers];
    newMedPlayers[index] = value;
    setMedPlayers(newMedPlayers);
  };

  return (
    <div className="booking-page">
      <h1>Ledige timer</h1>
      <div className="date-selector">
        <button onClick={() => handleDateChange("prev")}>{"<"}</button>
        <span>{new Date(selectedDate).toLocaleDateString("nb-NO", { day: "numeric", month: "long" })}</span>
        <button onClick={() => handleDateChange("next")}>{">"}</button>
      </div>

      <div className="filters">
        <select value={court} onChange={(e) => setCourt(e.target.value)} disabled={loading}>
          <option value="">Velg bane</option>
          <option value="Bane 1">Bane 1</option>
          <option value="Bane 2">Bane 2</option>
          <option value="Bane 3">Bane 3</option>
        </select>
        <select value={players} onChange={(e) => setPlayers(Number(e.target.value))} disabled={loading}>
          <option value={2}>2 spillere</option>
          <option value={4}>4 spillere</option>
        </select>
      </div>

      <div className="times-grid">
        {times.map((t) => (
          <button
            key={t}
            className={`time-button ${time === t ? "selected" : ""} ${
              isTimeBooked(t) ? "booked" : "available"
            }`}
            onClick={() => !isTimeBooked(t) && handleTimeClick(t)}
            disabled={loading || isTimeBooked(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="med-players">
        {Array.from({ length: players === 2 ? 1 : 3 }, (_, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Medspiller ${i + 1}`}
            value={medPlayers[i] || ""}
            onChange={(e) => handleMedPlayerChange(i, e.target.value)}
            disabled={loading || !time}
          />
        ))}
      </div>

      <button onClick={handleSubmit} disabled={loading || !time}>
        {loading ? "Booker..." : "Book"}
      </button>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default booking;