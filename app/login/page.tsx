import { AuthForm } from "@/components/auth/auth-form";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Layers } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center">
            <Layers className="h-6 w-6 mr-2" />
            <span className="font-semibold">EduFlow</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 grid place-items-center px-4 py-12">
        <div className="w-full max-w-md">
          <AuthForm view="sign_in" />
        </div>
      </main>
    </div>
  );
}