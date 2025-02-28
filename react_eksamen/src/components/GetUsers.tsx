import { useEffect, useState } from "react";
import { getUsers, updateUser, deleteUser } from "../api/users";
import { User } from "../types/types";
import "../pages/css/adminPanel.css";
import { useAuth } from "../auth/AuthContext";

const GetUsers = () => {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [updatedUserData, setUpdatedUserData] = useState<{ name: string; email: string; role: "user" | "admin" }>({
    name: "",
    email: "",
    role: "user",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getUsers();
        console.log("Fetched users:", data);
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Kunne ikke hente brukere.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    console.log("Editing user:", user);
    setEditingUser(user);
    setUpdatedUserData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !authUser || authUser.role !== "admin") {
      console.log("Cannot update: No editingUser, authUser, or not admin");
      return;
    }
    try {
      setLoading(true);
      console.log("Updating user with ID:", editingUser._id, "Data:", updatedUserData);
      const updatedUser = await updateUser(editingUser._id, updatedUserData);
      console.log("User updated successfully:", updatedUser);
      setUsers(users.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
      setEditingUser(null);
      setUpdatedUserData({ name: "", email: "", role: "user" });
      setError(null);
    } catch (err: unknown) {
      console.error("Error updating user:", err);
      setError("Kunne ikke oppdatere bruker. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateChange = (field: keyof typeof updatedUserData, value: string) => {
    setUpdatedUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Er du sikker på at du vil slette brukeren?")) return;
    try {
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      console.log("User deleted:", userId);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Kunne ikke slette brukeren.");
    }
  };

  if (loading) return <div>Laster brukere...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="get-users-container">
      <h2>Brukere</h2>

      <div className="users-header">
        <span>BrukerID</span>
        <span>Navn</span>
        <span>E-post</span>
        <span>Rolle</span>
      </div>

      <ul className="users-list">
        {users.map((user) => (
          <li className="user-item" key={user._id}>
            <span className="user-id">{user._id}</span>
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
            <span className="user-role">{user.role}</span>
            <div className="user-actions">
              <button className="edit-button" onClick={() => handleEdit(user)}>
                Endre
              </button>
              <button className="delete-button" onClick={() => handleDelete(user._id)}>
                Slett
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingUser && (
        <div className="edit-user-modal">
          <h3>Endre bruker</h3>
          <form onSubmit={handleUpdateSubmit}>
            <div className="modal-content" style={{ maxHeight: "50vh", overflowY: "auto" }}>
              <div>
                <label>Navn:</label>
                <input
                  type="text"
                  value={updatedUserData.name}
                  onChange={(e) => handleUpdateChange("name", e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label>E-post:</label>
                <input
                  type="email"
                  value={updatedUserData.email}
                  onChange={(e) => handleUpdateChange("email", e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label>Rolle:</label>
                <select
                  value={updatedUserData.role}
                  onChange={(e) => handleUpdateChange("role", e.target.value as "user" | "admin")}
                  disabled={loading}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button type="submit" disabled={loading}>
                {loading ? "Oppdaterer..." : "Lagre endringer"}
              </button>
              <button onClick={() => setEditingUser(null)} disabled={loading}>
                Avbryt
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GetUsers;