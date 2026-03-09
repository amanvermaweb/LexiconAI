"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ModelContext = createContext(null);

export const ModelProvider = ({ children }) => {
  const [model, setModel] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("model") || "";
  });

  useEffect(() => {
    localStorage.setItem("model", model);
  }, [model]);

  return (
    <ModelContext.Provider value={{ model, setModel }}>
      {children}
    </ModelContext.Provider>
  );
};

export const useModel = () => {
  const ctx = useContext(ModelContext);
  if (!ctx) throw new Error("useModel must be used inside ModelProvider");
  return ctx;
};
