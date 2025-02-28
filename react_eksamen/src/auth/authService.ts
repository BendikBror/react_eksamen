export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  token?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

export const register = async (userData: RegisterData): Promise<User> => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error("Registration failed");
  }
  return await response.json();
};

export const login = async (email: string, password: string): Promise<User> => {
  // Støtte for bruker admin pw admin som oppgaven krever
  if (email === "admin" && password === "admin") {
    return {
      _id: "0",
      name: "Admin",
      email: "admin@example.com",
      role: "admin",
      token: "mock-token",
    };
  }

  
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error("Kunne ikke hente brukere");
  }

  
  const users: (User & { password?: string })[] = await response.json();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    throw new Error("Ugyldig e-post eller passord");
  }

  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
};