import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BookDTO } from "../models/BookDTO";
import GenericList from "./GenericList";
import { fetchBooks } from "../services/BookService";

export default function SearchResults() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const name = query.get("name");
  const year = query.get("year");
  const type = query.get("type");

  const [results, setResults] = useState<BookDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [header, setHeader] = useState<string>("No books were found");

  useEffect(() => {
    const fetchResults = async () => {
      const queryParams = new URLSearchParams();
      if (name) queryParams.append("name", name);
      if (year) queryParams.append("year", year);
      if (type) queryParams.append("type", type);

      const apiUrl = `https://localhost:7091/api/Books?${queryParams.toString()}`;

      try {
        const data = await fetchBooks(apiUrl);
        setResults(data);
        if (data.length > 1) setHeader(`${data.length} books were found`);
        else setHeader(`${data.length} book was found`);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data.");
      }
    };
    fetchResults();
  }, [name, year, type]);

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <GenericList books={results} header={header} />
    </div>
  );
}
