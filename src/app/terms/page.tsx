import Header from "@/components/header";

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-secondary/20 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto bg-card p-8 rounded-lg shadow-md prose">
            <h1 className="text-4xl font-bold text-primary mb-4">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-2">1. Agreement to Terms</h2>
            <p>By using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our services.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-2">2. Description of Service</h2>
            <p>ParkWise provides a platform to find and book parking spots. While we strive for accuracy, we do not guarantee the availability or condition of any parking spot. The service is provided "as is".</p>

            <h2 className="text-2xl font-semibold mt-8 mb-2">3. User Accounts</h2>
            <p>You are responsible for safeguarding your account information. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-2">4. Termination</h2>
            <p>We may terminate or suspend your access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-2">5. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of the land, without regard to its conflict of law provisions.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-2">Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at: <a href="mailto:legal@parkwise.com" className="text-primary hover:underline">legal@parkwise.com</a>.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
