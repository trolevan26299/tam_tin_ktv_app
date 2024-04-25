"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidEmail } from "@/utils/isValidEmail";
import { Icon } from "@iconify/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      if (res?.url) router.push("/");
    } else {
      setError("");
    }
  };

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex flex-row items-center h-screen px-4">
        <Card className="mx-auto max-w-sm w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 pb-3" style={{ borderBottom: "1px solid #000 " }}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Vui lòng nhập email" required type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input id="password" required type="password" placeholder="Nhập mật khẩu" />
                </div>
                <Button className="w-full" type="submit">
                  Đăng nhập
                </Button>
                <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
              </div>
            </form>

            <Button
              className="w-full mt-3"
              variant="outline"
              onClick={() => {
                signIn("google", { redirect: false });
              }}
            >
              <Icon icon="flat-color-icons:google" width={20} className="mr-3" />
              Đăng nhập với Google
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  );
}
