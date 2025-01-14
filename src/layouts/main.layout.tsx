"use client";

import AddToHomeScreen from "@/sections/addToHomeScreen";

type Props = {
  children: React.ReactNode;
};
export default function MainLayout({ children }: Props) {
  return (
    <div className="flex flex-col bg-backgroundColor-main h-full min-h-screen font-sans">
      <AddToHomeScreen />
      <main className="flex-grow">{children}</main>
    </div>
  );
}
