
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useRouter } from "next/navigation";

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
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      carNumber: "",
    },
  });

  function onSubmit(data: BookingFormValues) {
    localStorage.setItem("bookingDetails", JSON.stringify(data));
    router.push("/signup");
  }

  return (
    <Card className="animate-fade-in-up">
        <CardHeader>
            <CardTitle className="text-3xl">Book Your Spot</CardTitle>
            <CardDescription>Enter your details to pre-book your parking slot.</CardDescription>
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
                    <FormDescription>
                        Please enter your full name.
                    </FormDescription>
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
                    <FormDescription>
                        Your vehicle's license plate number.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full">Proceed to Sign Up</Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
