import { useState, useEffect } from "react";
import axios from "axios";
import { Endpoint } from "./endpoints";

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: boolean;
}

function useFetch<T>(endpoint: Endpoint, id?: string): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = `https://localhost:7091/api/${endpoint}${
          id ? `/${id}` : ""
        }`;
        const response = await axios.get<T>(url);
        setData(response.data);
      } catch (fetchError) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}

export default useFetch;
