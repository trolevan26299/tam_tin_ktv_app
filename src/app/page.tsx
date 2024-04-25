"use client";

import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MenubarComponent } from "@/components/menu-bar/menu-bar";

const Home = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

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
    <div className=" text-white">
      <h1>Dashboard</h1>

      <button onClick={handleLogout} className="p-2 px-5  bg-blue-800 rounded-full">
        Logout
      </button>

      <MenubarComponent />
    </div>
  );
};

export default Home;
