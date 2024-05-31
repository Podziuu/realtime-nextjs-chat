import { BackgroundBeams } from "@/components/ui/background-beams";
import TailwindButton from "@/components/ui/tailwindcss-buttons";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen flex-col bg-black">
      <h1 className="text-5xl font-bold text-white">
        Welcome to realtime chat app!
      </h1>
      <div className="mt-8 space-x-8">
        <TailwindButton text="Sign up!" link="/signup" />
        <TailwindButton text="Log in!" link="/login" />
      </div>
      <BackgroundBeams />
    </main>
  );
}
