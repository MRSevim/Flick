"use client";
import { useEffect } from "react";

export const ClientInitializer = () => {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null;
};
