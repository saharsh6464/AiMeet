import React, { createContext, useContext, useEffect, useState } from "react";
import { getTopic } from "../service/Topic"; // adjust path as needed

// Create context
const TopicContext = createContext();

// Custom hook for easy usage
export const useTopics = () => useContext(TopicContext);

export const TopicProvider = ({ children }) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all topics on mount
  useEffect(() => {
    let cancelled = false;

    const fetchTopics = async () => {
      try {
        setLoading(true);
        const res = await getTopic();
        console.log("getTopic() raw:", res);

        const arr =
          Array.isArray(res) ? res :
          Array.isArray(res?.data) ? res.data :
          Array.isArray(res?.topics) ? res.topics :
          [];

        console.log("getTopic() normalized:", arr);

        if (!cancelled) setTopics(arr);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to fetch topics");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTopics();
    return () => { cancelled = true; };
  }, []);

  // Optional helper to refresh topics manually
  const refreshTopics = async () => {
    try {
      setLoading(true);
      const res = await getTopic();
      const arr = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      setTopics(arr);
    } catch (e) {
      setError(e?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TopicContext.Provider value={{ topics, loading, error, refreshTopics }}>
      {children}
    </TopicContext.Provider>
  );
};
