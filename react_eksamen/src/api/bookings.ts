import { Booking, NewBooking, UpdateBooking } from "../types/types";
import { User } from "../types/types";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Oppretter en ny booking med POST

export const createBooking = async (bookingData: NewBooking): Promise<Booking> => {
  const response = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create booking: ${errorText}`);
  }

  return await response.json();
};

// Henter alle bookinger med GET, filtrert basert på brukerrolle
export const getBookings = async (user: User | null): Promise<Booking[]> => {
  const response = await fetch(`${BASE_URL}/bookings`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch bookings: ${errorText}`);
  }

  const bookings = await response.json();
  if (user?.role === "user") {
    return bookings.filter((booking: Booking) => booking.player === user._id);
  }
  return bookings;
};

// Henter en spesifikk booking med GET

export const getBookingById = async (id: string): Promise<Booking> => {
  const response = await fetch(`${BASE_URL}/bookings/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch booking: ${errorText}`);
  }

  return await response.json();
};

// Oppdaterer en booking med PUT

export const updateBooking = async (
  id: string,
  bookingData: UpdateBooking
): Promise<Booking> => {
  const existingBooking = await getBookingById(id);

  console.log("Updating booking with ID:", id, "Data:", bookingData);
  const response = await fetch(`${BASE_URL}/bookings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...existingBooking, 
      ...bookingData,     
    }),
  });

  console.log("Update response status:", response.status);
  console.log("Update response headers:", response.headers);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error updating booking:", errorText);
    throw new Error(`Failed to update booking: ${errorText}`);
  }

  // Prøv å parse JSON hvis responsen har en kropp, ellers returner den eksisterende bookingen
  let updatedBooking: Booking = existingBooking;
  if (response.status !== 204) { 
    try {
      updatedBooking = await response.json();
    } catch (e) {
      console.warn("Failed to parse JSON response, using existing booking:", e);
    }
  }

  console.log("Updated booking:", updatedBooking);
  return updatedBooking;
};

// Sletter en booking basert på ID med DELETE

export const deleteBooking = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/bookings/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete booking: ${errorText}`);
  }

  
};