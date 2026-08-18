import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Map, Wallet, Bot } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Real-Time Availability",
      description: "Our network of IoT sensors provides live, up-to-the-second data on which parking slots are open, so you can head directly to a vacant spot without guessing."
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M12 14h0"/></svg>,
      title: "One-Click Booking",
      description: "Found the perfect spot? Reserve it instantly with a single click. We'll hold it for you for 15 minutes, giving you plenty of time to arrive and park."
    },
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: "AI-Powered Tips",
      description: "Our smart assistant analyzes your parking habits and real-time lot data to suggest the best available spots for you, optimizing for convenience and walking distance."
    },
    {
      icon: <Map className="h-8 w-8 text-primary" />,
      title: "Live Map Tracking",
      description: "Navigate any parking lot with ease using our live map, which shows your current location and highlights available spots nearby to guide you."
    },
    {
      icon: <Wallet className="h-8 w-8 text-primary" />,
      title: "Seamless Payments",
      description: "Connect your payment method for hassle-free entry and exit. No need to fumble with cash or cards at the gate. Drive in and out, and we'll handle the rest."
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>,
      title: "Booking History",
      description: "Keep track of all your previous parking sessions. View receipts, analyze your parking expenses, and export data all in one convenient place."
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-secondary/20 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-2">ParkWise Features</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need for a stress-free parking experience.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
