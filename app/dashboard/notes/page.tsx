import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, PenLine, FileText } from "lucide-react";

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Notes</h1>
          <p className="text-muted-foreground mt-2">
            Organize and manage your study notes.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/notes/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Note
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for notes */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <PenLine className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Sample Note</CardTitle>
            </div>
            <CardDescription>
              Created on January 15, 2024
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This is a sample note to demonstrate the layout.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                View Note
              </Button>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Empty state */}
        <Card className="border-dashed border-2 hover:border-solid transition-colors">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <PenLine className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notes yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start taking notes to organize your learning.
            </p>
            <Button asChild>
              <Link href="/dashboard/notes/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Note
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 