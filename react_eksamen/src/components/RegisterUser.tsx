import { useState } from "react";
import { addUser } from "../api/users";
import { User } from "../types/types";
import { useAuth } from "../auth/AuthContext";

const AddUser = () => {
  const { user } = useAuth();
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<string>("user");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddUser = async () => {
    if (!name || !password || !email) {
      alert("vennligst fyll inn navn, passord og epost.");
      return;
    }

    setLoading(true);

    try {
      const newUser: User = await addUser(name, role, email, password);
      console.log("User added successfully:", newUser);
      alert(`User ${newUser.name} added successfully!`);
      setName("");
      setEmail("");
      setRole("user");
      setPassword("");
    } catch (error: any) {
      console.error("Error adding user:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="register-input"
      />
      <input
        type="text"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="register-input"
      />
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="register-input"
      />
      {user?.role === "admin" ? (
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="register-input"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      ) : (
        <input type="hidden" value="user" />
      )}
      <button
        onClick={handleAddUser}
        disabled={loading}
        className="register-button"
      >
        {loading ? "Adding..." : "Add User"}
      </button>
    </div>
  );
};

export default AddUser;
