
import { BookingForm } from "@/components/booking-form";
import Header from "@/components/header";

export default function BookingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-secondary/20 p-4">
        <div className="w-full max-w-2xl">
          <BookingForm />
        </div>
      </main>
    </div>
  );
}
