// bookings.test.ts
import {
    createBooking,
    getBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
  } from '../api/bookings';
  import { Booking, NewBooking, UpdateBooking, User } from '../types/types';
  
  describe('Bookings CRUD functions', () => {
    beforeEach(() => {
      // Reset mocks before each test to avoid cross-test interference
      jest.resetAllMocks();
    });
  
    describe('createBooking', () => {
      it('throws an error if a booking collision is detected', async () => {
        // Simulate an existing booking that collides with the new booking
        const existingBooking: Booking = {
          _id: '123',
          player: 'user1',
          court: 'Court1',
          players: 2,
          date: '2025-03-01',
          time: '10:00',
          medPlayers: [],
        };
  
        // First fetch call (inside createBooking) is getBookings()
        (global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
          ok: true,
          json: async () => [existingBooking],
        });
  
        // This new booking conflicts with existingBooking
        const newBooking: NewBooking = {
          player: 'user2',
          court: 'Court1',
          players: 2,
          date: '2025-03-01',
          time: '10:00',
          medPlayers: [],
        };
  
        await expect(createBooking(newBooking)).rejects.toThrow(
          'Denne tiden og banen er allerede booket.'
        );
      });
  
      it('creates a booking successfully if there is no collision', async () => {
        // getBookings() returns empty array => no collision
        (global.fetch as jest.Mock) = jest
          .fn()
          .mockResolvedValueOnce({
            ok: true,
            json: async () => [],
          })
          .mockResolvedValueOnce({
            ok: true,
            json: async () => ({
              _id: 'newId',
              player: 'user2',
              court: 'Court2',
              players: 2,
              date: '2025-03-02',
              time: '11:00',
              medPlayers: [],
            }),
          });
  
        const newBooking: NewBooking = {
          player: 'user2',
          court: 'Court2',
          players: 2,
          date: '2025-03-02',
          time: '11:00',
          medPlayers: [],
        };
  
        const createdBooking = await createBooking(newBooking);
        expect(createdBooking).toHaveProperty('_id', 'newId');
        expect(createdBooking.court).toBe(newBooking.court);
        expect(createdBooking.date).toBe(newBooking.date);
        // etc.
      });
    });
  
    describe('getBookings', () => {
      it('fetches and returns all bookings when user is null', async () => {
        const bookings: Booking[] = [
          {
            _id: '1',
            player: 'user1',
            court: 'Court1',
            players: 2,
            date: '2025-03-01',
            time: '10:00',
            medPlayers: [],
          },
          {
            _id: '2',
            player: 'user2',
            court: 'Court2',
            players: 4,
            date: '2025-03-02',
            time: '11:00',
            medPlayers: [],
          },
        ];
  
        (global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
          ok: true,
          json: async () => bookings,
        });
  
        const result = await getBookings(null);
        expect(result).toEqual(bookings);
      });
  
      it('filters bookings for a user with role "user"', async () => {
        const allBookings: Booking[] = [
          {
            _id: '1',
            player: 'user1',
            court: 'Court1',
            players: 2,
            date: '2025-03-01',
            time: '10:00',
            medPlayers: [],
          },
          {
            _id: '2',
            player: 'user2',
            court: 'Court2',
            players: 4,
            date: '2025-03-02',
            time: '11:00',
            medPlayers: [],
          },
        ];
  
        (global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
          ok: true,
          json: async () => allBookings,
        });
  
        const user: User = {
          _id: 'user1',
          name: 'User1',
          email: 'user1@example.com',
          role: 'user',
        };
  
        const result = await getBookings(user);
        // Should only return bookings where booking.player === 'user1'
        expect(result).toEqual([allBookings[0]]);
      });
    });
  
    describe('getBookingById', () => {
      it('fetches a booking by id successfully', async () => {
        const booking: Booking = {
          _id: '1',
          player: 'user1',
          court: 'Court1',
          players: 2,
          date: '2025-03-01',
          time: '10:00',
          medPlayers: [],
        };
  
        (global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
          ok: true,
          json: async () => booking,
        });
  
        const result = await getBookingById('1');
        expect(result).toEqual(booking);
      });
  
      it('throws an error when the fetch fails', async () => {
        (global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
          ok: false,
          text: async () => 'Error occurred',
        });
  
        await expect(getBookingById('1')).rejects.toThrow(
          'Failed to fetch booking: Error occurred'
        );
      });
    });
  
    describe('updateBooking', () => {
      it('updates a booking successfully when the response includes JSON', async () => {
        const existingBooking: Booking = {
          _id: '1',
          player: 'user1',
          court: 'Court1',
          players: 2,
          date: '2025-03-01',
          time: '10:00',
          medPlayers: [],
        };
  
        const updateData: UpdateBooking = {
          time: '12:00',
          // other optional fields...
        };
  
        // First fetch call: getBookingById
        // Second fetch call: PUT request
        (global.fetch as jest.Mock) = jest
          .fn()
          .mockResolvedValueOnce({
            ok: true,
            json: async () => existingBooking,
          })
          .mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({
              ...existingBooking,
              ...updateData,
            }),
          });
  
        const updatedBooking = await updateBooking('1', updateData);
        expect(updatedBooking.time).toBe('12:00');
      });
  
      it('returns the existing booking if the update response has a 204 status', async () => {
        const existingBooking: Booking = {
          _id: '1',
          player: 'user1',
          court: 'Court1',
          players: 2,
          date: '2025-03-01',
          time: '10:00',
          medPlayers: [],
        };
  
        const updateData: UpdateBooking = {
          time: '12:00',
        };
  
        (global.fetch as jest.Mock) = jest
          .fn()
          .mockResolvedValueOnce({
            ok: true,
            json: async () => existingBooking,
          })
          .mockResolvedValueOnce({
            ok: true,
            status: 204,
            text: async () => '',
          });
  
        const updatedBooking = await updateBooking('1', updateData);
        // Because the response is 204, we never parse a new JSON object,
        // so the function returns the existing booking.
        expect(updatedBooking.time).toBe('10:00');
      });
  
      it('throws an error when the update fails', async () => {
        const existingBooking: Booking = {
          _id: '1',
          player: 'user1',
          court: 'Court1',
          players: 2,
          date: '2025-03-01',
          time: '10:00',
          medPlayers: [],
        };
  
        const updateData: UpdateBooking = {
          time: '12:00',
        };
  
        (global.fetch as jest.Mock) = jest
          .fn()
          .mockResolvedValueOnce({
            ok: true,
            json: async () => existingBooking,
          })
          .mockResolvedValueOnce({
            ok: false,
            text: async () => 'Update error',
          });
  
        await expect(updateBooking('1', updateData)).rejects.toThrow(
          'Failed to update booking: Update error'
        );
      });
    });
  
    describe('deleteBooking', () => {
      it('deletes a booking successfully', async () => {
        (global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
          ok: true,
          text: async () => '',
        });
  
        await expect(deleteBooking('1')).resolves.toBeUndefined();
      });
  
      it('throws an error when deletion fails', async () => {
        (global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
          ok: false,
          text: async () => 'Delete error',
        });
  
        await expect(deleteBooking('1')).rejects.toThrow(
          'Failed to delete booking: Delete error'
        );
      });
    });
  });
  