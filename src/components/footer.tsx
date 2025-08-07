import Link from "next/link";
import { ParkingSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link className="flex items-center space-x-2" href="/">
              <ParkingSquare className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">ParkWise</span>
            </Link>
            <p className="text-sm text-accent-foreground/80">
              The smartest way to find and book parking.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:underline">About Us</Link>
              </li>
              <li>
                <Link href="/features" className="text-sm hover:underline">Features</Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm hover:underline">Pricing</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm hover:underline">FAQ</Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:underline">Contact Us</Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:underline">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:underline">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <p className="text-sm">123 Parking Lane, Car City, 54321</p>
            <p className="text-sm mt-2">
              Email:{" "}
              <a href="mailto:support@parkwise.com" className="hover:underline">
                support@parkwise.com
              </a>
            </p>
            <p className="text-sm mt-2">
              Phone:{" "}
              <a href="tel:+1234567890" className="hover:underline">
                (123) 456-7890
              </a>
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-accent-foreground/20 pt-4 text-center text-sm text-accent-foreground/60">
          <p>&copy; {new Date().getFullYear()} ParkWise. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
