"use client";

import { DashboardView } from "@/sections/dashboard/view";
import { useEffect } from "react";


export default function Home() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => console.log('SW registered:', registration))
        .catch((error) => console.log('SW registration failed:', error));
    }
  }, []);
  return <DashboardView />;
}
