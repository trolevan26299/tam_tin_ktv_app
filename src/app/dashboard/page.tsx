"use client";

import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Dashboard = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  console.log("data", session);
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace("/login");
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24 text-white">
      <h1>Dashboard</h1>

      <button onClick={handleLogout} className="p-2 px-5 -mt-1 bg-blue-800 rounded-full">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
