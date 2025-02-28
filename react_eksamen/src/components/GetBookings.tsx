import { useState, useEffect } from "react";
import { getBookings, updateBooking, deleteBooking } from "../api/bookings";
import type { Booking, UpdateBooking } from "../types/types";
import { useAuth } from "../auth/AuthContext";

const GetBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [updatedData, setUpdatedData] = useState<UpdateBooking>({
    court: "",
    players: 0,
    date: "",
    time: "",
    medPlayers: [],
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getBookings(user || null);
        setBookings(data);
      } catch (err) {
        setError("Kunne ikke hente bookinger.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const handleDelete = async (bookingId: string) => {
    if (!window.confirm("Er du sikker på at du vil slette denne bookingen?")) return;
    try {
      setLoading(true);
      await deleteBooking(bookingId);
      setBookings(bookings.filter((b) => b._id !== bookingId));
      setError(null);
    } catch (err: unknown) {
      setError("Kunne ikke slette booking. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setUpdatedData({
      court: booking.court,
      players: booking.players,
      date: booking.date,
      time: booking.time,
      medPlayers: booking.medPlayers || [],
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking || !updatedData) return;
    try {
      setLoading(true);
      const updatedBooking = await updateBooking(editingBooking._id, updatedData);
      setBookings(bookings.map((b) => (b._id === updatedBooking._id ? updatedBooking : b)));
      setEditingBooking(null);
      setUpdatedData({ court: "", players: 0, date: "", time: "", medPlayers: [] });
      setError(null);
    } catch (err: unknown) {
      setError("Kunne ikke oppdatere booking. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateChange = (field: keyof UpdateBooking, value: string | number | string[]) => {
    setUpdatedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) return <div>Laster bookinger...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="admin-bookings">
      <h3>Alle bookinger</h3>
      {bookings.length === 0 ? (
        <p>Ingen bookinger.</p>
      ) : (
        <div className="bookings-flex">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div>
                <p><strong>Bane:</strong> {booking.court}</p>
                <p><strong>Dato:</strong> {booking.date}</p>
                <p><strong>Tid:</strong> {booking.time}</p>
                <p><strong>Antall spillere:</strong> {booking.players}</p>
                <p><strong>Medspillere:</strong> {Array.isArray(booking.medPlayers) ? booking.medPlayers.join(", ") : "Ingen"}</p>
                <p><strong>Spiller:</strong> {booking.player}</p>
              </div>
              <div className="booking-actions">
                <button onClick={() => handleEdit(booking)}>Endre</button>
                <button onClick={() => handleDelete(booking._id)}>Slett</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingBooking && (
        <div className="edit-booking-modal">
          <h4>Endre booking</h4>
          <form onSubmit={handleUpdateSubmit}>
            <div className="modal-content" style={{ maxHeight: "50vh", overflowY: "auto" }}>
              <div>
                <label>Bane:</label>
                <select
                  value={updatedData.court || ""}
                  onChange={(e) => handleUpdateChange("court", e.target.value)}
                  disabled={loading}
                >
                  <option value="">Velg bane</option>
                  <option value="Bane 1">Bane 1</option>
                  <option value="Bane 2">Bane 2</option>
                  <option value="Bane 3">Bane 3</option>
                </select>
              </div>
              <div>
                <label>Antall spillere:</label>
                <select
                  value={updatedData.players || 2}
                  onChange={(e) => handleUpdateChange("players", Number(e.target.value))}
                  disabled={loading}
                >
                  <option value={2}>2 spillere</option>
                  <option value={4}>4 spillere</option>
                </select>
              </div>
              <div>
                <label>Dato:</label>
                <input
                  type="date"
                  value={updatedData.date || ""}
                  onChange={(e) => handleUpdateChange("date", e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label>Tid:</label>
                <input
                  type="time"
                  value={updatedData.time || ""}
                  onChange={(e) => handleUpdateChange("time", e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label>Medspillere:</label>
                <input
                  type="text"
                  value={(updatedData.medPlayers || []).join(", ")}
                  onChange={(e) => handleUpdateChange("medPlayers", e.target.value.split(", ").map((p) => p.trim()).filter((p) => p !== ""))}
                  placeholder="Navn separert med komma"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button type="submit" disabled={loading}>
                {loading ? "Oppdaterer..." : "Lagre endringer"}
              </button>
              <button onClick={() => setEditingBooking(null)} disabled={loading}>
                Avbryt
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GetBookings;