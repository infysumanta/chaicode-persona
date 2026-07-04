import { AppHeader } from "@/components/app-header";
import { HomeContent } from "@/components/home-content";

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-0 flex-1 overflow-y-auto">
        <HomeContent />
      </main>
    </>
  );
}
