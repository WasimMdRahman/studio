import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const tiers = [
    {
      name: "Pay-as-you-go",
      price: "Free",
      description: "Perfect for occasional parkers. No commitment.",
      features: [
        "Real-Time Availability",
        "Standard Booking",
        "Email Support",
      ],
      cta: "Sign Up",
      href: "/signup",
    },
    {
      name: "Commuter",
      price: "$9.99",
      period: "/ month",
      description: "Ideal for daily commuters looking for convenience.",
      features: [
        "Everything in Pay-as-you-go",
        "Priority Booking",
        "AI-Powered Parking Tips",
        "Monthly Expense Reports",
        "Priority Support",
      ],
      cta: "Get Started",
      href: "/signup",
    },
    {
      name: "Business",
      price: "Contact Us",
      description: "Custom solutions for fleets and businesses.",
      features: [
        "Everything in Commuter",
        "Dedicated Account Manager",
        "Fleet Management Dashboard",
        "Custom Integrations",
        "Volume Discounts",
      ],
      cta: "Contact Sales",
      href: "/contact",
    }
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-secondary/20 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-2">Simple, Transparent Pricing</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Choose the plan that's right for you. No hidden fees, ever.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tiers.map((tier) => (
              <Card key={tier.name} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={tier.href}>{tier.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
