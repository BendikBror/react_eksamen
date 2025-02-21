import { useState } from "react";
import { deleteUser } from "../api/users";

const DeleteUser = () => {
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleDeleteUser = async () => {
    if (!userId) {
      alert("Please enter a user ID.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await deleteUser(userId);
      setMessage(response.message);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Delete User</h2>
      <input
        type="text"
        placeholder="Enter user ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={handleDeleteUser} disabled={loading}>
        {loading ? "Deleting..." : "Delete User"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default DeleteUser;
