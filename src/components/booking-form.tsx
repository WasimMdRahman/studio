
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./auth-provider";


const bookingFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  carNumber: z.string().min(3, {
    message: "Car number must be at least 3 characters.",
  }),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export function BookingForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      carNumber: "",
    },
  });

  function onSubmit(data: BookingFormValues) {
    // This form is now primarily for users who aren't signed in.
    // We will store their details to pre-fill the signup form.
    const bookingDetails = {
        ...data,
        // We add a placeholder for slot details which will be selected on the dashboard
        slotId: null, 
        durationHours: null,
        totalPrice: null,
    }
    localStorage.setItem("pendingBooking", JSON.stringify(bookingDetails));

    if(user) {
        toast({ title: "Info", description: "Please select a slot from the dashboard to book."});
        router.push('/dashboard');
    } else {
        router.push("/signup");
    }
  }

  return (
    <Card className="animate-fade-in-up">
        <CardHeader>
            <CardTitle className="text-3xl">Enter Your Details</CardTitle>
            <CardDescription>First, let us know who you are and what you're driving.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                        <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="carNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Car Number</FormLabel>
                    <FormControl>
                        <Input placeholder="ABC-123" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full">
                    {user ? 'Go to Dashboard' : 'Proceed to Sign Up'}
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
