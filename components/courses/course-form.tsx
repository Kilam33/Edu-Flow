"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const courseSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export function CourseForm({ 
  course 
}: { 
  course?: any;
}) {
  const router = useRouter();
  const [tag, setTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultValues: Partial<CourseFormValues> = {
    title: course?.title || "",
    description: course?.description || "",
    coverImage: course?.cover_image || "",
    tags: course?.tags || [],
  };
  
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues,
  });
  
  const onSubmit = async (data: CourseFormValues) => {
    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const courseData = {
        title: data.title,
        description: data.description,
        cover_image: data.coverImage,
        tags: data.tags,
        user_id: user.id,
      };
      
      let result;
      if (course) {
        // Update existing course
        result = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', course.id);
          
        if (result.error) throw result.error;
        toast.success("Course updated successfully");
      } else {
        // Create new course
        result = await supabase
          .from('courses')
          .insert(courseData)
          .select();
          
        if (result.error) throw result.error;
        toast.success("Course created successfully");
      }
      
      // Navigate to course page or course list
      router.push('/dashboard/courses');
      router.refresh();
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error("Failed to save course");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const addTag = () => {
    if (tag.trim() === "") return;
    
    const currentTags = form.getValues("tags") || [];
    if (!currentTags.includes(tag.trim())) {
      form.setValue("tags", [...currentTags, tag.trim()]);
      setTag("");
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((t) => t !== tagToRemove)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Course title" {...field} />
              </FormControl>
              <FormDescription>
                The name of your course.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Course description"
                  className="min-h-[120px]"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                A brief description of the course content.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/image.jpg"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                URL for the course cover image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="tags"
          render={() => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add a tag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" onClick={addTag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {form.watch("tags")?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tag}</span>
                    </Button>
                  </Badge>
                ))}
              </div>
              <FormDescription>
                Add relevant tags to help categorize your course.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : course ? "Update Course" : "Create Course"}
          </Button>
        </div>
      </form>
    </Form>
  );
}