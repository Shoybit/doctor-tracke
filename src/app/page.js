"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "./lib/api";

export default function Home() {
  const [message, setMessage] = useState("Checking backend...");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const data = await apiFetch("/health");
        setMessage(data.message);
      } catch (error) {
        setMessage(error.message);
      }
    };

    checkBackend();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">{message}</h1>
    </main>
  );
}