"use client";
import { useEffect } from "react";

const ClientInitializer = () => {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null;
};

export default ClientInitializer;
