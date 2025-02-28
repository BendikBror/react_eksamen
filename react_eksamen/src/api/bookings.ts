import { Booking, NewBooking, UpdateBooking } from "../types/types";
import { User } from "../types/types";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Oppretter en ny booking med POST
export const createBooking = async (
  bookingData: NewBooking
): Promise<Booking> => {
  console.log("Creating booking with data:", bookingData);

  // Hent alle eksisterende bookinger for å sjekke kollisjoner
  const allBookings = await getBookings(null); // Hent alle bookinger (ikke filtrert på bruker ennå)

  // Sjekk om den foreslåtte booking-tiden kolliderer med eksisterende bookinger
  const collision = allBookings.find((booking) => {
    return (
      booking.court === bookingData.court && // Samme bane
      booking.date === bookingData.date && // Samme dato
      booking.time === bookingData.time // Samme tid
    );
  });

  if (collision) {
    throw new Error(
      "Denne tiden og banen er allerede booket. Velg en annen tid eller bane."
    );
  }

  const response = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response:", errorText);
    throw new Error(`Failed to create booking: ${errorText}`);
  }

  const booking = await response.json();
  console.log("Created booking:", booking);
  return booking;
};

// Henter alle bookinger med GET, filtrert basert på brukerrolle
export const getBookings = async (user: User | null): Promise<Booking[]> => {
  console.log("Fetching bookings for user:", user);
  console.log("Fetching bookings from:", `${BASE_URL}/bookings`);
  const response = await fetch(`${BASE_URL}/bookings`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("Response status:", response.status);
  console.log("Response headers:", response.headers);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response:", errorText);
    throw new Error(`Failed to fetch bookings: ${errorText}`);
  }

  const bookings = await response.json();
  console.log("Fetched bookings data:", bookings);
  if (user?.role === "user") {
    return bookings.filter((booking: Booking) => booking.player === user._id);
  }
  return bookings; // For admin, returner alle bookinger
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
