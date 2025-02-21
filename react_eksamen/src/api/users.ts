import { User } from "../types/types";

const BASE_URL = import.meta.env.VITE_BASE_URL; 

// oppretter en bruker med POST

export const addUser = async (name: string, usertype: string): Promise<User> => {
    const response = await fetch(
      `${BASE_URL}/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, usertype }),
      }
    );
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add user: ${errorText}`);
    }
  
    return await response.json();
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
  export const updateUser = async (
    id: string,
    userData: { name: string; email: string; role: string }
  ): Promise<User> => {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update user: ${errorText}`);
    }
  
    return await response.json();
  };

  // sletter en bruker basert på ID med DELETE
  export const deleteUser = async (id: string): Promise<{ message: string }> => {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete user: ${errorText}`);
    }
  
    return await response.json();
  };


