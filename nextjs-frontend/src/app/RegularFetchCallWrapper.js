"use client";
import { useEffect } from "react";

export const RegularFetchCallWrapper = ({ children }) => {
  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch("/api");
      const json = await response.json();
      console.log("fetch call made, json: " + json);
    }, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
};
