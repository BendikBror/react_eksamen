import { User } from "../types/types";

const BASE_URL = import.meta.env.VITE_BASE_URL; 

// oppretter en bruker med POST

export const addUser = async (name: string, role: string, email: string, password: string): Promise<User> => {
  const emailExists = await checkEmailExists(email);
  if (emailExists) {
    throw new Error("E-posten er allerede i bruk.");
  }

  const response = await fetch(
    `${BASE_URL}/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, role, email, password }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to add user: ${errorText}`);
  }

  return await response.json();
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    if (!response.ok) throw new Error("Failed to fetch users");

    const users: User[] = await response.json();
    return users.some((user) => user.email === email);
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
};


  //henter alle brukere med GET

  export const getUsers = async (): Promise<User[]> => {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch users: ${errorText}`);
    }
  
    return await response.json();
  };
  
  // henter en spesifik bruker basert på ID med GET

export const getUserById = async (id: string): Promise<User> => {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch user: ${errorText}`);
    }
  
    return await response.json();
  };

  // oppdatere en bruker med PUT
  export const updateUser = async (id: string, userData: { name: string; email: string; role: "user" | "admin" }): Promise<User> => {
    console.log("Updating user with ID:", id, "Data:", userData);
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
  
    console.log("Update response status:", response.status);
    console.log("Update response headers:", response.headers);
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error updating user:", errorText);
      throw new Error(`Failed to update user: ${errorText}`);
    }
  
    let updatedUser: User = await getUserById(id);
    if (response.status !== 204) {
      try {
        updatedUser = await response.json();
      } catch (e) {
        console.warn("Failed to parse JSON response, using existing user:", e);
      }
    }
  
    console.log("Updated user:", updatedUser);
    return updatedUser;
  };

  // sletter en bruker basert på ID med DELETE
  export const deleteUser = async (userId: string) => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/${userId}`, {
      method: "DELETE",
    });
  
    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
  
    return response.json();
  };
