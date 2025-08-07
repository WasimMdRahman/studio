import Header from "@/components/header";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-secondary/20 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto bg-card p-8 rounded-lg shadow-md prose">
            <h1 className="text-4xl font-bold text-primary mb-4">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-2">1. Introduction</h2>
            <p>Welcome to ParkWise. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-2">2. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
            <ul>
              <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and payment information, that you voluntarily give to us when you register with the application.</li>
              <li><strong>Usage Data:</strong> Information our servers automatically collect when you access the app, such as your IP address, browser type, and the pages you have viewed.</li>
              <li><strong>Location Data:</strong> We may request access or permission to and track location-based information from your mobile device to provide location-based services.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-2">3. Use of Your Information</h2>
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:</p>
            <ul>
              <li>Create and manage your account.</li>
              <li>Process your transactions.</li>
              <li>Email you regarding your account or order.</li>
              <li>Improve our application and services.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-2">4. Contact Us</h2>
            <p>If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@parkwise.com" className="text-primary hover:underline">privacy@parkwise.com</a></p>
          </div>
        </div>
      </main>
    </div>
  );
}
