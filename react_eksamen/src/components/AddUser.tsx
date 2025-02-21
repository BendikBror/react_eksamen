import { useState } from "react";
import { addUser } from "../api/users";
import { User } from "../types/types";

const AddUser = () => {
  const [name, setName] = useState<string>("");
  const [usertype, setUsertype] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddUser = async () => {
    if (!name || !usertype) {
      alert("Please enter both name and user type.");
      return;
    }

    setLoading(true);

    try {
      const newUser: User = await addUser(name, usertype);
      console.log("User added successfully:", newUser);
      alert(`User ${newUser.name} added successfully!`);
      setName(""); // Reset form
      setUsertype("");
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user.");
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
      />
      <input
        type="text"
        placeholder="Enter user type"
        value={usertype}
        onChange={(e) => setUsertype(e.target.value)}
      />
      <button onClick={handleAddUser} disabled={loading}>
        {loading ? "Adding..." : "Add User"}
      </button>
    </div>
  );
};

export default AddUser;