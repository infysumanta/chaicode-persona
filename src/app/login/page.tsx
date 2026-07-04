"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { PERSONA_LIST } from "@/lib/personas";
import Image from "next/image";
import { useState } from "react";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.7.5.5 5.7.5 12a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.6 18 4.9 18 4.9c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5A11.5 11.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5Z" />
    </svg>
  );
}
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7C21.8 19 23 15.9 23 12.3Z" />
      <path fill="#34A853" d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.8H1.7v3C3.6 21.3 7.5 24 12 24Z" />
      <path fill="#FBBC05" d="M5.6 14.6a7.2 7.2 0 0 1 0-4.6V7H1.7a12 12 0 0 0 0 10.7l3.9-3.1Z" />
      <path fill="#EA4335" d="M12 4.8c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.3 15.1 0 12 0 7.5 0 3.6 2.7 1.7 6.3l3.9 3C6.5 6.8 9 4.8 12 4.8Z" />
    </svg>
  );
}

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const signIn = (provider: "github" | "google") => {
    setLoading(provider);
    authClient.signIn.social({ provider, callbackURL: "/" });
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border bg-card/70 p-8 backdrop-blur shadow-xl">
        <div className="mb-6 flex -space-x-3 justify-center">
          {PERSONA_LIST.map((p) => (
            <Image
              key={p.id}
              src={p.avatar}
              alt={p.name}
              width={64}
              height={64}
              className="rounded-full ring-2 ring-background"
            />
          ))}
        </div>
        <h1 className="text-center text-2xl font-bold">Chai aur Code</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Chat with AI personas of{" "}
          <span className="font-medium text-foreground">Hitesh Choudhary</span> &{" "}
          <span className="font-medium text-foreground">Piyush Garg</span>. Sign in to start.
        </p>

        <div className="mt-8 space-y-3">
          <Button
            className="w-full"
            size="lg"
            onClick={() => signIn("github")}
            disabled={loading !== null}
          >
            <GitHubIcon /> Continue with GitHub
          </Button>
          <Button
            className="w-full"
            size="lg"
            variant="outline"
            onClick={() => signIn("google")}
            disabled={loading !== null}
          >
            <GoogleIcon /> Continue with Google
          </Button>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Educational fan project. Personas are AI imitations, not the real people.
        </p>
      </div>
    </main>
  );
}
