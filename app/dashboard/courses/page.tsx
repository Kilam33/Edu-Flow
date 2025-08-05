import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen } from "lucide-react";

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground mt-2">
            Manage your courses and learning materials.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/courses/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for courses - you can replace this with actual course data */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Sample Course</CardTitle>
            </div>
            <CardDescription>
              This is a sample course to demonstrate the layout.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Course description and details will appear here.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                View Course
              </Button>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Empty state when no courses exist */}
        <Card className="border-dashed border-2 hover:border-solid transition-colors">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first course to get started with your learning journey.
            </p>
            <Button asChild>
              <Link href="/dashboard/courses/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Course
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 