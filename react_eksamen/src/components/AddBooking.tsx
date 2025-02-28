import { useState } from "react";
import { createBooking } from "../api/bookings";
import type { NewBooking } from "../types/types";
import { useAuth } from "../auth/AuthContext";

const AddBooking = () => {
  const { user } = useAuth();
  const [court, setCourt] = useState<string>("");
  const [players, setPlayers] = useState<number>(2);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [medPlayers, setMedPlayers] = useState<string[]>([""]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddBooking = async () => {
    if (!user) {
      setError("Du må være logget inn som admin for å opprette bookinger.");
      return;
    }

    if (!court || !date || !time) {
      setError("Vennligst fyll ut bane, dato og tid.");
      return;
    }

    if (![2, 4].includes(players)) {
      setError("Antall spillere må være 2 eller 4.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const bookingData: NewBooking = {
      player: user._id, // Admin oppretter bookinger for spillere, eller bruk en dummy-ID
      court,
      players,
      date,
      time,
      medPlayers: medPlayers.filter((p) => p.trim() !== ""),
    };

    try {
      const newBooking = await createBooking(bookingData);
      setSuccess("Booking opprettet!");
      setCourt("");
      setPlayers(2);
      setDate("");
      setTime("");
      setMedPlayers([""]);
    } catch (err) {
      setError("Kunne ikke opprette booking. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  const handleMedPlayerChange = (index: number, value: string) => {
    const newMedPlayers = [...medPlayers];
    newMedPlayers[index] = value;
    setMedPlayers(newMedPlayers);
  };

  return (
    <div className="admin-booking-form">
      <h3>Opprett booking</h3>
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
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        disabled={loading}
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        disabled={loading}
      />
      <div className="med-players">
        {Array.from({ length: players === 2 ? 1 : 3 }, (_, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Medspiller ${i + 1}`}
            value={medPlayers[i] || ""}
            onChange={(e) => handleMedPlayerChange(i, e.target.value)}
            disabled={loading}
          />
        ))}
      </div>
      <button onClick={handleAddBooking} disabled={loading}>
        {loading ? "Oppretter..." : "Opprett booking"}
      </button>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default AddBooking;