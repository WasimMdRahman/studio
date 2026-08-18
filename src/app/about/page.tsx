import Header from "@/components/header";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-secondary/20 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto bg-card p-8 rounded-lg shadow-md">
            <h1 className="text-4xl font-bold text-primary mb-4">About ParkWise</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Founded in 2024, ParkWise was born from a simple idea: parking shouldn't be a hassle.
              Our team of urban planners, software engineers, and AI specialists came together to solve one of the most common frustrations of city living.
            </p>
            <p className="mb-4">
              We saw an opportunity to leverage technology to create a smarter, more efficient parking experience for everyone. By using real-time data from a network of IoT sensors, we provide drivers with up-to-the-second information on parking availability, saving them time, fuel, and unnecessary stress.
            </p>
            <p className="mb-4">
              Our mission is to revolutionize the urban mobility landscape. We believe that by making parking seamless and intelligent, we can reduce traffic congestion, lower carbon emissions, and make our cities more livable.
            </p>
            <p className="font-semibold text-foreground">
              Thank you for joining us on this journey to build the future of parking.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
