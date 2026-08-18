import Header from "@/components/header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  const faqs = [
    {
      question: "How does ParkWise work?",
      answer: "ParkWise uses a network of IoT sensors installed in parking lots. These sensors detect whether a spot is vacant or occupied and send this data to our servers in real-time. You can then see the live availability on our app and book a spot instantly."
    },
    {
      question: "How long is my booking held for?",
      answer: "When you book a spot, we hold it for you for 15 minutes. This gives you plenty of time to drive to your reserved spot. If you don't arrive within that time, the booking is automatically cancelled to make the spot available for others."
    },
    {
      question: "Can I cancel a booking?",
      answer: "Yes, you can cancel your active booking at any time directly from the app dashboard. Simply click on your booked slot, and you'll have the option to release it."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We support all major credit cards, Apple Pay, and Google Pay for seamless and secure payments. All transactions are handled through a certified payment processor."
    },
    {
      question: "Is ParkWise available in my city?",
      answer: "We are rapidly expanding! Our app currently serves major metropolitan areas. You can check the list of supported cities directly in the app or on our website. If we're not in your city yet, you can sign up to be notified when we launch there."
    }
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-secondary/20 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-primary mb-2">Frequently Asked Questions</h1>
              <p className="text-lg text-muted-foreground">Find answers to the most common questions about ParkWise.</p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-semibold">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
    </div>
  );
}
