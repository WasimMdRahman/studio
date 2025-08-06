"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { LogOut, ParkingSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link className="mr-6 flex items-center space-x-2" href="/dashboard">
            <ParkingSquare className="h-6 w-6 text-primary"/>
            <span className="font-bold text-foreground">ParkWise</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user && (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline-block">{user.email}</span>
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
