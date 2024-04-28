"use client";

import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";

const Dashboard = () => {
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
    <div className='flex min-h-screen flex-col items-center justify-between p-5 text-white'>
      <div className='flex w-full justify-between'>
        <h1>Dashboard</h1>
        <button
          onClick={handleLogout}
          className='p-2 px-5 -mt-1 bg-blue-800 rounded-full'
        >
          Logout
        </button>
      </div>

      <div className='flex w-full h-10 text-center justify-center bg-white rounded-lg'>
        <Link href='/webcam'>
          <Icon
            icon='material-symbols-light:qr-code-scanner'
            color='black'
            width='100%'
            className='cursor-pointer'
          />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
