import { useState } from "react";
import { getUserById } from "../api/users";
import { User } from "../types/types";

const GetUser = () => {
  const [userId, setUserId] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchUser = async () => {
    if (!userId) {
      alert("Please enter a user ID.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchedUser = await getUserById(userId);
      setUser(fetchedUser);
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Failed to fetch user.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Get User by ID</h2>
      <input
        type="text"
        placeholder="Enter user ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={handleFetchUser} disabled={loading}>
        {loading ? "Loading..." : "Fetch User"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {user && (
        <div>
          <h3>User Details</h3>
          <p>ID: {user._id}</p>
          <p>Name: {user.name}</p>
          <p>User Type: {user.role}</p>
        </div>
      )}
    </div>
  );
};

export default GetUser;
