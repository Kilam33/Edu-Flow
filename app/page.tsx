import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Layers, PenLine, Video } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero section */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    Learn effectively with rich notes &amp; research
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Create, manage, and enhance your learning with our powerful platform for online education.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button asChild size="lg" className="gap-1">
                    <Link href="/register">
                      Get Started
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              </div>
              <div className="relative flex items-center justify-center rounded-xl bg-muted p-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-background p-6 shadow-sm">
                    <BookOpen className="h-12 w-12 text-primary" />
                    <h3 className="mt-4 text-xl font-bold">Course Management</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Create and manage online courses with ease.</p>
                  </div>
                  <div className="rounded-lg bg-background p-6 shadow-sm">
                    <Video className="h-12 w-12 text-primary" />
                    <h3 className="mt-4 text-xl font-bold">Video Integration</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Embed videos to enhance your teaching materials.</p>
                  </div>
                  <div className="rounded-lg bg-background p-6 shadow-sm">
                    <PenLine className="h-12 w-12 text-primary" />
                    <h3 className="mt-4 text-xl font-bold">Rich Note-Taking</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Take comprehensive notes while learning.</p>
                  </div>
                  <div className="rounded-lg bg-background p-6 shadow-sm">
                    <Layers className="h-12 w-12 text-primary" />
                    <h3 className="mt-4 text-xl font-bold">Multiple Exports</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Export your notes to various formats.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="bg-muted py-20 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Key Features
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  EduFlow provides everything you need to create and manage your online courses.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 pt-12 md:grid-cols-3 md:gap-12">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Course Creation</h3>
                <p className="text-sm text-muted-foreground">
                  Easily create and organize your online courses with our intuitive interface.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Video className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Video Content</h3>
                <p className="text-sm text-muted-foreground">
                  Upload and embed videos to enhance your teaching materials and engage your students.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <PenLine className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Rich Note-Taking</h3>
                <p className="text-sm text-muted-foreground">
                  Take comprehensive notes with our powerful rich text editor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-16 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to get started?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Sign up today and transform the way you create and manage your online courses.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild size="lg" className="gap-1">
                  <Link href="/register">
                    Create an Account
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6" />
            <p className="text-sm font-medium">EduFlow © 2025</p>
          </div>
          <nav className="flex gap-4 text-sm">
            <Link href="/terms" className="text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}