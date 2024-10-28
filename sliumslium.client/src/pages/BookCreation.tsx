import React, { useEffect, useRef, useState } from "react";
import { BookDTO } from "../models/BookDTO";
import { postBook } from "../services/BookService";
import FileUpload from "../components/Utils/FileUpload";

export default function BookCreation() {
  const selectRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    if (selectRef.current) {
      M.FormSelect.init(selectRef.current);
    }
  }, []);

  const [book, setBook] = useState<BookDTO>({
    id: 0,
    name: "",
    year: new Date().getFullYear(),
    type: "Book",
    pictureUrl: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      M.toast({
        html: "Please select an image file to upload.",
        classes: "red",
      });
      return;
    }

    if (!book.name || !book.type) {
      M.toast({
        html: "Please provide valid book name and type.",
        classes: "red",
      });
      return;
    }
    await postBook(book, file);
  };

  return (
    <div className="container">
      <h2>Create a New Book</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Book Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={book.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="year">Publication Year:</label>
          <input
            type="number"
            id="year"
            name="year"
            value={book.year}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            name="type"
            value={book.type}
            onChange={handleChange}
            ref={selectRef}
            required
          >
            <option value="" disabled>
              Choose your option
            </option>
            <option value="Book">Book</option>
            <option value="Audiobook">Audiobook</option>
          </select>
        </div>
        <FileUpload onFileSelect={handleFileSelect} />
        <div className="center-align">
          <button type="submit">Create Book</button>
        </div>
      </form>
    </div>
  );
}
