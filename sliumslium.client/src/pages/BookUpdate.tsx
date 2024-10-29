import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookDTO } from "../models/BookDTO";
import { getBookById, updateBook } from "../services/BookService";

const BookUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<BookDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const fetchedBook = await getBookById(id as unknown as number);
        setBook(fetchedBook);
      } catch (err) {
        setError("Error fetching book data.");
      }
    };
    fetchBook();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updatedBook: BookDTO = {
      ...book,
      name: formData.get("name") as string,
      year: Number(formData.get("year")),
      type: formData.get("type") as string,
      pictureUrl: formData.get("pictureUrl") as string,
    };

    await updateBook(updatedBook);
    navigate("/");
  };

  if (error) {
    return (
      <div className="container center-align">
        <h3>{error}</h3>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container center-align">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="container">
      <h3>Update Book</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <input type="text" name="name" defaultValue={book.name} required />
          <label>Title</label>
        </div>
        <div className="input-field">
          <input type="number" name="year" defaultValue={book.year} required />
          <label>Year</label>
        </div>
        <div className="input-field">
          <input type="text" name="type" defaultValue={book.type} required />
          <label>Type</label>
        </div>
        <div className="input-field">
          <input
            type="text"
            name="pictureUrl"
            defaultValue={book.pictureUrl}
            required
          />
          <label>PictureUrl</label>
        </div>
        <button type="submit" className="btn">
          Update Book
        </button>
      </form>
    </div>
  );
};

export default BookUpdate;
