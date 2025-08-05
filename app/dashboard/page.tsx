"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, BookOpen, PenLine, Video, ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Course {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          setUserData(profileData);
          
          // Get courses
          const { data: coursesData, error: coursesError } = await supabase
            .from('courses')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(4);
          
          if (coursesError) throw coursesError;
          setCourses(coursesData || []);
          
          // Get recent notes
          const { data: notesData, error: notesError } = await supabase
            .from('notes')
            .select(`
              *,
              lessons:lesson_id (
                title,
                course_id,
                courses:course_id (
                  title
                )
              )
            `)
            .eq('user_id', user.id)
            .order('last_updated', { ascending: false })
            .limit(3);
          
          if (notesError) throw notesError;
          setRecentNotes(notesData || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome {userData?.full_name || userData?.username || 'back'} to your learning platform!
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="my-courses">My Courses</TabsTrigger>
          <TabsTrigger value="my-notes">My Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Quick actions */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Create Course
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">
                  Create a new course and add lessons
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" className="w-full" asChild>
                  <Link href="/dashboard/courses/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Course
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Add Content
                </CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">
                  Upload videos and add them to your lessons
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" className="w-full" asChild>
                  <Link href="/dashboard/videos/upload">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Upload Video
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Take Notes
                </CardTitle>
                <PenLine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">
                  Create and manage your lesson notes
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" className="w-full" asChild>
                  <Link href="/dashboard/notes">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Note
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Recent Courses */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Recent Courses</h2>
              <Button variant="link" size="sm" asChild>
                <Link href="/dashboard/courses">
                  View all
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 pt-4 md:grid-cols-2 lg:grid-cols-4">
              {loading ? (
                Array(4).fill(0).map((_, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-9 w-full" />
                    </CardFooter>
                  </Card>
                ))
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <Card key={course.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-3 h-16">
                        {course.description || "No description provided."}
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button size="sm" className="w-full" asChild>
                        <Link href={`/dashboard/courses/${course.id}`}>
                          View Course
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle>No courses yet</CardTitle>
                    <CardDescription>
                      Create your first course to get started
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/dashboard/courses/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Course
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
          
          {/* Recent Notes */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Recent Notes</h2>
              <Button variant="link" size="sm" asChild>
                <Link href="/dashboard/notes">
                  View all
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                Array(3).fill(0).map((_, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-12 w-full" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-9 w-full" />
                    </CardFooter>
                  </Card>
                ))
              ) : recentNotes.length > 0 ? (
                recentNotes.map((note) => (
                  <Card key={note.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-1 text-lg">
                        {note.lessons?.title || "Untitled Lesson"}
                      </CardTitle>
                      <CardDescription className="line-clamp-1">
                        {note.lessons?.courses?.title || "Untitled Course"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="line-clamp-2 text-sm text-muted-foreground">
                        {/* Simplified content display - would need proper rendering */}
                        {(note.content && typeof note.content === 'object') 
                          ? "Note content available" 
                          : "No content"}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button size="sm" className="w-full" asChild>
                        <Link href={`/dashboard/lessons/${note.lesson_id}`}>
                          Continue
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle>No notes yet</CardTitle>
                    <CardDescription>
                      Take notes while watching course lessons
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/dashboard/courses">
                        Browse Courses
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="my-courses">
          <div className="space-y-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold tracking-tight">My Courses</h2>
              <Button asChild>
                <Link href="/dashboard/courses/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Course
                </Link>
              </Button>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {loading ? (
                Array(8).fill(0).map((_, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-9 w-full" />
                    </CardFooter>
                  </Card>
                ))
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <Card key={course.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-3 h-16">
                        {course.description || "No description provided."}
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button size="sm" className="w-full" asChild>
                        <Link href={`/dashboard/courses/${course.id}`}>
                          View Course
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle>No courses yet</CardTitle>
                    <CardDescription>
                      Create your first course to get started
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/dashboard/courses/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Course
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="my-notes">
          <div className="space-y-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold tracking-tight">My Notes</h2>
              <Button asChild>
                <Link href="/dashboard/notes">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Note
                </Link>
              </Button>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                Array(6).fill(0).map((_, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-12 w-full" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-9 w-full" />
                    </CardFooter>
                  </Card>
                ))
              ) : recentNotes.length > 0 ? (
                recentNotes.map((note) => (
                  <Card key={note.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-1 text-lg">
                        {note.lessons?.title || "Untitled Lesson"}
                      </CardTitle>
                      <CardDescription className="line-clamp-1">
                        {note.lessons?.courses?.title || "Untitled Course"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="line-clamp-2 text-sm text-muted-foreground">
                        {/* Simplified content display - would need proper rendering */}
                        {(note.content && typeof note.content === 'object') 
                          ? "Note content available" 
                          : "No content"}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button size="sm" className="w-full" asChild>
                        <Link href={`/dashboard/lessons/${note.lesson_id}`}>
                          Continue
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle>No notes yet</CardTitle>
                    <CardDescription>
                      Take notes while watching course lessons
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/dashboard/courses">
                        Browse Courses
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}