import { CourseForm } from "@/components/courses/course-form";

export default function NewCoursePage() {
  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Course</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details to create a new course.
        </p>
      </div>
      
      <CourseForm />
    </div>
  );
}