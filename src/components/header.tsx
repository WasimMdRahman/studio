
"use client";

import { Button } from "@/components/ui/button";
import { ParkingSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const router = useRouter();

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
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
