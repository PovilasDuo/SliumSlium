// services/bookService.ts
import axios from 'axios';
import { BookDTO } from '../models/BookDTO';

const BASE_URL = 'https://localhost:7091/api/Books';

export const fetchBooks = async (): Promise<BookDTO[]> => {
    try {
        const response = await axios.get<BookDTO[]>(`${BASE_URL}/All`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.message);
            console.error('Response data:', error.response?.data); // More detailed logging
        } else {
            console.error('Unexpected error:', error);
        }
        throw error; // Rethrow the error if needed
    }
};
