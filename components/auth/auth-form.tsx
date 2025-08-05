"use client";

import { useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AuthFormProps {
  view?: "sign_in" | "sign_up" | "forgotten_password";
}

export function AuthForm({ view = "sign_in" }: AuthFormProps) {
  const router = useRouter();
  const [authView, setAuthView] = useState<"sign_in" | "sign_up" | "forgotten_password">(view);

  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_IN") {
      router.push("/dashboard");
      router.refresh();
    }
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {authView === "sign_in" 
            ? "Welcome back" 
            : authView === "sign_up" 
            ? "Create an account" 
            : "Reset your password"}
        </CardTitle>
        <CardDescription>
          {authView === "sign_in" 
            ? "Enter your email to sign in to your account" 
            : authView === "sign_up" 
            ? "Enter your email to create your account" 
            : "Enter your email to reset your password"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Auth
          supabaseClient={supabase}
          view={authView}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(var(--foreground-rgb))',
                  brandAccent: 'hsl(var(--primary))',
                  inputText: 'hsl(var(--foreground))',
                  inputLabelText: 'hsl(var(--foreground))',
                  inputBackground: 'hsl(var(--background))',
                  inputBorder: 'hsl(var(--input))',
                  brandButtonText: '#000000',
                  defaultButtonBackground: 'hsl(var(--primary))',
                  defaultButtonBackgroundHover: 'hsl(var(--primary))',
                }
              }
            },
            className: {
              button: 'bg-primary text-black hover:bg-primary/90 w-full font-medium !text-black',
              input: 'bg-background border border-input text-foreground placeholder:text-muted-foreground',
              label: 'text-sm font-medium text-foreground',
            }
          }}
          providers={[]}
          redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '/auth/callback'}
        />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {authView === "sign_in" ? (
          <>
            <Button 
              variant="link" 
              onClick={() => setAuthView("forgotten_password")}
              className="px-0"
            >
              Forgot your password?
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Button 
                variant="link" 
                onClick={() => setAuthView("sign_up")}
                className="px-1"
              >
                Sign up
              </Button>
            </div>
          </>
        ) : authView === "sign_up" ? (
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Button 
              variant="link" 
              onClick={() => setAuthView("sign_in")}
              className="px-1"
            >
              Sign in
            </Button>
          </div>
        ) : (
          <Button 
            variant="link" 
            onClick={() => setAuthView("sign_in")}
            className="px-0"
          >
            Back to sign in
          </Button>
        )}
        <div className="text-sm text-center text-muted-foreground mt-6">
          <Link href="/" className="hover:underline">
            Back to home
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}