"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";

const Dashboard = () => {
  const router = useRouter();
  const [state, setState] = useState<{
    keyword: string;
    device: any;
  }>({
    keyword: "",
    device: {},
  });
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

  const handleChangeDevice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, keyword: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/device/${state.keyword}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data) {
        setState((prev) => ({ ...prev, device: data }));
      }
    } catch (error) {
      console.log(error);
    }
  };

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
      <div className='max-w-2xl mx-auto w-full'>
        <form onSubmit={handleSubmit}>
          <label className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300'>
            Search
          </label>
          <div className='relative'>
            <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
              <svg
                className='w-5 h-5 text-gray-500 dark:text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                ></path>
              </svg>
            </div>
            <input
              type='search'
              id='default-search'
              className='block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='Search ...'
              required
              value={state.keyword}
              onChange={handleChangeDevice}
            />
            <button
              type='submit'
              className='text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            >
              Search
            </button>
          </div>
        </form>
        <span className='text-white'>{state.device.belong_to}</span>
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
