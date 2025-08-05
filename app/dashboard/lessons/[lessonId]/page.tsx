"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { TipTapEditor } from "@/components/editor/tiptap-editor";
import { ExportNoteMenu } from "@/components/notes/export-note-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LessonPage() {
  const params = useParams();
  const lessonId = (Array.isArray(params.lessonId) ? params.lessonId[0] : params.lessonId) as string;
  const [lesson, setLesson] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [note, setNote] = useState<any>(null);
  const [noteContent, setNoteContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("User not authenticated");
        }
        
        // Get lesson details
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select(`
            *,
            courses:course_id (*)
          `)
          .eq('id', lessonId)
          .single();
        
        if (lessonError) throw lessonError;
        
        setLesson(lessonData);
        setCourse(lessonData.courses);
        
        // Get or create note
        const { data: noteData, error: noteError } = await supabase
          .from('notes')
          .select('*')
          .eq('lesson_id', lessonId)
          .eq('user_id', user.id)
          .single();
        
        if (noteError) {
          if (noteError.code === 'PGRST116') { // Code for "no rows returned"
            // Create a new note
            const { data: newNote, error: createError } = await supabase
              .from('notes')
              .insert({
                lesson_id: lessonId,
                user_id: user.id,
                content: {
                  type: 'doc',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: ''
                        }
                      ]
                    }
                  ]
                }
              })
              .select()
              .single();
            
            if (createError) throw createError;
            setNote(newNote);
            setNoteContent(newNote.content);
          } else {
            throw noteError;
          }
        } else {
          setNote(noteData);
          setNoteContent(noteData.content);
        }
      } catch (error) {
        console.error('Error fetching lesson data:', error);
        toast.error("Failed to load lesson data");
      } finally {
        setLoading(false);
      }
    };
    
    if (lessonId) {
      fetchData();
    }
  }, [lessonId]);
  
  const handleSaveNote = async () => {
    if (!note || !noteContent) return;
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('notes')
        .update({
          content: noteContent,
          last_updated: new Date().toISOString()
        })
        .eq('id', note.id);
      
      if (error) throw error;
      
      toast.success("Notes saved successfully");
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error("Failed to save notes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {loading ? (
        <>
          <div className="space-y-2">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
          </div>
          <Skeleton className="h-[300px] w-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        </>
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold">{lesson?.title}</h1>
            <p className="text-muted-foreground mt-1">
              {course?.title}
            </p>
            {lesson?.description && (
              <p className="mt-4">{lesson.description}</p>
            )}
          </div>
          
          {lesson?.video_url && (
            <div className="aspect-video bg-muted rounded-md">
              <video
                src={lesson.video_url}
                controls
                className="w-full h-full rounded-md"
                poster={course?.cover_image}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Notes</h2>
              <div className="flex items-center gap-2">
                <ExportNoteMenu
                  content={noteContent}
                  title={`${lesson?.title} - Notes`}
                  disabled={!noteContent}
                />
                <Button
                  variant="default"
                  size="sm"
                  className="gap-1"
                  onClick={handleSaveNote}
                  disabled={saving}
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <TipTapEditor
              content={noteContent}
              onChange={setNoteContent}
              className="mt-4"
            />
          </div>
        </>
      )}
    </div>
  );
}